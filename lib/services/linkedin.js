import axios from 'axios';
import * as cheerio from 'cheerio';

const base_url = 'https://www.linkedin.com/jobs/search';

function constructUrl(params = {}){
    const url = new URL(base_url);
    const {
        keyword,
        location,
        page,
        num_pages,
        sort,
        ...rest
    } = params || {};

    if (keyword != null) url.searchParams.set('keywords', keyword);
    if (location != null) url.searchParams.set('location', location);
    if (page != null) url.searchParams.set('page', page);
    if (num_pages != null) url.searchParams.set('num_pages', num_pages);
    if (sort != null) url.searchParams.set('sort', sort);

    // Pass-through for any additional LinkedIn filters (e.g., geoId, f_TPR, f_PP, f_WT, f_E, etc.)
    for (const [key, value] of Object.entries(rest)){
        if (value == null) continue;
        url.searchParams.set(key, value);
    }
    return url.toString();
}

async function requestJobs(params = {}){
    const url = constructUrl(params);

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        "Referrer": "https://www.linkedin.com"
    };

    const maxAttempts = 5;
    let attempt = 0;
    let lastError;

    while (attempt < maxAttempts){
        try {
            const response = await axios.get(url, { headers, timeout: 15000 });
            return response.data;
        } catch (error) {
            lastError = error;
            attempt += 1;
            const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }

    throw lastError || new Error('Failed to fetch jobs');
}

function scrapeJobs(html){
    const $ = cheerio.load(html);
    const jobs = [];

	function cleanText(text){
		return (text || '')
			.replace(/\s+/g, ' ')
			.trim();
	}

	// New LinkedIn public jobs DOM structure
	$('ul.jobs-search__results-list li div.base-card.job-search-card').each((_, el) => {
		const element = $(el);

		// Core fields with robust fallbacks
		const link = element.find('a.base-card__full-link').attr('href')
			|| element.find('a.base-card__full-link[href]').attr('href')
			|| '';
		const title = cleanText(
			element.find('h3.base-search-card__title').text()
			|| element.find('.base-search-card__title').text()
		);
		const companyAnchor = element.find('h4.base-search-card__subtitle a, .base-search-card__subtitle a');
		const company = cleanText(
			companyAnchor.text()
			|| element.find('h4.base-search-card__subtitle').text()
			|| element.find('.base-search-card__subtitle').text()
		);
		const companyLink = companyAnchor.attr('href') || '';
		const location = cleanText(
			element.find('span.job-search-card__location').text()
			|| element.find('.base-search-card__metadata .job-search-card__location').text()
		);
		// Time shown in different variants
		const timeEl = element.find('time.job-search-card__listdate, time.job-search-card__listdate--new').first();
		const listedAtISO = timeEl.attr('datetime') || '';
		const listedAtText = cleanText(timeEl.text() || element.find('time').first().text());
		// Actively hiring flag
		const activelyHiring = /actively\s+hiring/i.test(cleanText(element.find('.job-posting-benefits__text').text()));
		// Promoted/sponsored flag when present
		const promoted = /promoted|sponsored/i.test(cleanText(element.find('[class*="promoted"], [class*="sponsored"]').text()));
		const entityUrn = element.attr('data-entity-urn') || '';
		// Company logo may be in different attributes
		const companyLogo = element.find('.search-entity-media img').attr('src')
			|| element.find('img[data-delayed-url]').attr('data-delayed-url')
			|| element.find('img').attr('src')
			|| '';
		// Infer simple workplace hint from location text
		const isRemote = /remote/i.test(location);

		let jobId = '';
		const urnMatch = entityUrn.match(/urn:li:jobPosting:(\d+)/);
		if (urnMatch) jobId = urnMatch[1];
		if (!jobId && link){
			const linkId = link.match(/jobs\/view\/[^-]*-(\d+)/);
			if (linkId) jobId = linkId[1];
		}

		// Only push if we at least have a title or link
		if (title || link){
			jobs.push({
				id: jobId,
				title,
				company,
				companyLink,
				companyLogo,
				location,
				link,
				listedAtISO,
				listedAtText,
				activelyHiring,
				promoted,
				isRemote,
				entityUrn,
			});
		}
	});

	// Fallback for older DOM (job-result-card)
	if (jobs.length === 0){
		$('div.job-result-card').each((_, el) => {
			const element = $(el);
			const title = cleanText(element.find('h3.job-result-card__title').text());
			const company = cleanText(element.find('div.job-result-card__company').text());
			if (title || company){
				jobs.push({ title, company });
			}
		});
	}
    return jobs;
}

async function requestJobDetails(slugOrId){
    const idMatch = String(slugOrId || '').match(/(\d+)$/);
    const id = idMatch ? idMatch[1] : String(slugOrId || '');
    const url = /^https?:\/\//.test(slugOrId)
        ? slugOrId
        : `https://www.linkedin.com/jobs/view/${slugOrId.includes(id) ? slugOrId : id}`;

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        "Referrer": "https://www.linkedin.com"
    };

    const maxAttempts = 5;
    let attempt = 0;
    let lastError;

    while (attempt < maxAttempts){
        try {
            const response = await axios.get(url, { headers, timeout: 15000 });
            return response.data;
        } catch (error) {
            lastError = error;
            attempt += 1;
            const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
            await new Promise(r => setTimeout(r, delayMs));
        }
    }

    throw lastError || new Error('Failed to fetch job details');
}

function scrapeJobDetails(html, slugOrId){
    const $ = cheerio.load(html);

    function cleanText(text){
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function extractApplyUrl(){
        const primary = $('#applyUrl').html() || '';
        const sources = [primary, html || ''];

        function extractFrom(source, preferredPrefix){
            if (!source) return '';
            let start = -1;
            if (preferredPrefix) start = source.indexOf(preferredPrefix);
            if (start === -1) start = source.indexOf('https://');
            if (start === -1) return '';
            const terminators = ['"', "'", '<', '>', ' ', '\n', '\r'];
            let end = start;
            while (end < source.length && !terminators.includes(source[end])) end++;
            return source.slice(start, end).replace(/&amp;/g, '&');
        }

        for (const src of sources){
            const ext = extractFrom(src, 'https://www.linkedin.com/jobs/view/externalApply/');
            if (ext) return ext;
        }
        for (const src of sources){
            const any = extractFrom(src);
            if (any) return any;
        }
        return '';
    }

    const idMatch = String(slugOrId || '').match(/(\d+)$/);
    const id = idMatch ? idMatch[1] : cleanText($('#decoratedJobPostingId').text()) || '';

    const title = cleanText($('.top-card-layout__title, .sub-nav-cta__header').first().text());
    const company = cleanText($('.topcard__org-name-link, .sub-nav-cta__optional-url').first().text());
    const companyLink = $('.topcard__org-name-link, .sub-nav-cta__optional-url').first().attr('href') || '';
    const location = cleanText($('.topcard__flavor--bullet, .sub-nav-cta__meta-text').first().text());
    const postedTimeAgo = cleanText($('.posted-time-ago__text').first().text());
    const applicantsText = cleanText($('.num-applicants__caption').first().text());
    function getImageSrc($el){
        return (
            $el.attr('src')
            || $el.attr('data-delayed-url')
            || $el.attr('data-delayed-src')
            || ''
        );
    }
    // Robust company logo resolution across multiple LinkedIn DOM variants
    const logoSelectors = [
        'img.sub-nav-cta__image',
        '.sub-nav-cta img.artdeco-entity-image',
        '.top-card-layout__card img.artdeco-entity-image',
        '.top-card-layout img.artdeco-entity-image',
        'img.artdeco-entity-image',
    ];
    let companyLogo = '';
    for (const sel of logoSelectors){
        const src = getImageSrc($(sel).first());
        if (src){ companyLogo = src; break; }
    }
    const applyUrl = extractApplyUrl();

    const compensation = cleanText($('.compensation__salary-range .salary, .compensation__salary').first().text());

    const descriptionHtml = (
        $('.description__text .show-more-less-html__markup').first().html()
        || $('.description__text--rich .show-more-less-html__markup').first().html()
        || ''
    ).trim();
    const descriptionText = cleanText($('.description__text').first().text());

    const criteria = [];
    $('.description__job-criteria-list .description__job-criteria-item').each((_, li) => {
        const label = cleanText($(li).find('.description__job-criteria-subheader').text());
        const value = cleanText($(li).find('.description__job-criteria-text').text());
        if (label || value){
            criteria.push({ label, value });
        }
    });

    const url = `https://www.linkedin.com/jobs/view/${slugOrId}`;

    return {
        id: String(id || ''),
        url,
        title,
        company,
        companyLink,
        companyLogo,
        location,
        postedTimeAgo,
        applicantsText,
        compensation,
        applyUrl,
        descriptionHtml,
        descriptionText,
        criteria,
    };
}

export { requestJobs, scrapeJobs, requestJobDetails, scrapeJobDetails };