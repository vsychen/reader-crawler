import request from 'request';
import cheerio from 'cheerio';
import URL from 'url-parse';
import iconv from 'iconv-lite';
import fs from 'fs';

let base_url = "";
let title = "";
let chapters = 0;
let encode = "";

let pages_downloaded = 0;
let visited = {};
let pages_visited = 0;
let limit = 0;
let to_visit = [];

const formatTitle = (title) => {
  title = title.split(/[*:?]+/).join("-");

  return title;
}

const collectLinks = (page) => {
  let relativeLinks = page("a[href^='/']");
  let url = "";
  console.log("Found " + relativeLinks.length + " relative links on page");

  relativeLinks.each(function() {
    url = base_url + page(this).attr('href');

    if (url.indexOf('#') !== -1) {
      url = url.substr(0, url.indexOf('#'));
    }

    to_visit.push(url);
  });
}

const saveChapter = (page) => {
  let page_title = formatTitle(page('html > head > title').text());
  let body_content = page('html > body > div #contentbox').text().trim();

  console.log("Saving chapter " + page_title);
  fs.writeFile("./pages/" + page_title + ".txt", body_content, function(err) { if (err) { console.log("[SAVE CHAPTER ERROR]: " + err); } });
}

const searchInTitle = (page, title) => {
  let page_title = page('html > head > title').text();
  let found = page_title.indexOf(title) !== -1;

  return found;
}

const visitPage = (page_url, callback) => {
  console.log("Visiting page " + page_url);
  visited[page_url] = true;
  pages_visited++;

  request({ uri: page_url, encoding: null, }, function(err, res, raw_page) {
    if (err) {
      console.log("[ERROR] > " + err);
      return;
    } else if (res.statusCode !== 200) {
      console.log("[ERROR] > Status code: " + res.statusCode);
      callback();
      return;
    }
    
    let page = iconv.decode(raw_page, encode);
    let $ = cheerio.load(page);
    let found = searchInTitle($, title);

    if (found) {
      saveChapter($);
      pages_downloaded++;
    }

    collectLinks($);
    callback();
  });
}

const crawl = () => {
  if (pages_downloaded >= chapters) {
    console.log("All chapters acquired.");
    return;
  } else if (pages_visited >= limit) {
    console.log("Number of pages visited exceeded.");
    return;
  }

  let next_page = to_visit.shift();

  if (next_page in visited) {
    crawl();
  } else {
    visitPage(next_page, crawl);
  }
}

function Spider() {}

Spider.prototype.start = function(root_url, book_title, number_of_chapters, encoding) {
  let url = new URL(root_url);

  base_url = url.protocol + "//" + url.hostname;
  title = book_title;
  chapters = (Math.ceil(number_of_chapters/1000))*1000;
  limit = number_of_chapters*10;
  encode = encoding;

  to_visit.push(root_url);
  crawl();
};

export default Spider;