import { Router } from "express";
import { scrapper, filterURL } from "./scrapper.js";

const router = Router();

router.get("/", (req, res) => {
	res.render("home");
});

router.get("/test", (req, res) => {
	res.render("test");
});

router.post("/scrap", (req, res) => {
	const urls = filterURL(req.body.urlList);
	res.render("results", { length: urls.length });
	urls.forEach((url) => scrapper(url));
});

export default router;
