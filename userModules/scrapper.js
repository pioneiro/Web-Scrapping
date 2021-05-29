import fetch from "node-fetch";
import { load } from "cheerio";
import { sendData, sendError } from "./socket.js";

const urlRegEx = new RegExp(/https?:\/\/(www\.)?/gi);

const getURL = (link, parent) => new URL(link, parent).href;

const getMetaData = ($, name) =>
	$(`meta[name=${name}]`).attr("content") ||
	$(`meta[property="og:${name}"]`).attr("content") ||
	$(`meta[property="twitter:${name}"]`).attr("content");

const scrapper = async (url) => {
	const res = await fetch(url).catch((error) =>
		sendError({ url, error: error.message })
	);
	if (res) {
		const $ = load(
			await res
				.text()
				.catch((error) => sendError({ url, error: error.message }))
		);

		const data = {
			url: url,
			title: $("title").first().text().trim() || new URL(url).hostname,
			favicon: $("link[rel='shortcut icon']").attr("href"),
			description: getMetaData($, "description") || "No Description Found",
			image: getMetaData($, "image"),
		};

		if (!data.favicon) data.favicon = "/default.svg";
		else data.favicon = getURL(data.favicon, data.url);

		if (!data.image) data.image = "/default.svg";
		else data.image = getURL(data.image, data.url);

		sendData(data);
	}
};

const filterURL = (urlList) =>
	urlList.split("\r\n").filter((url) => url.match(urlRegEx));

export { scrapper, filterURL };
