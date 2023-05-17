var $ = document.getElementById.bind(document);
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const sourceType = urlParams.get("s");
  let albumTitle = $("title"),
    albumIdText = $("id"),
    albumLoc = $("loc-type"),
    urlDiv = $("external-urls"),
    thumbUrl = $("thumb-url"),
    origninalUrl = $("original-url"),
    altText = $("alt-text"),
    albumDate = $("date"),
    albumTime = $("time"),
    albumForm = $("album-form"),
    charCount = $("char-count"),
    type = 0,
    title = "",
    albumId = "",
    location = "",
    permalink = "",
    date = "2023-05-10 18:16:35 +0530";

    altText.addEventListener("input", function (e) {
   
      let value = e.target.value;
      let alts = value.split("\n");
      let counts = alts[0].length
      for(i=1; i<alts.length; i++){
        counts += ` ,${alts[i].length}`;
      }
      charCount.textContent  = counts;
    })
  if (sourceType == "1") {
    albumLoc.selectedIndex = 1;
    urlDiv.style.display = "block";
    thumbUrl.required = true;
    origninalUrl.required = true;
    altText.required = true
  }
  if (albumTitle) {
    albumTitle.addEventListener("input", function (e) {
      let id = e.target.value.replaceAll(" ", "-").toLowerCase();
      albumIdText.value = id;
    });
    console.log("It's up and running!");
    albumLoc.addEventListener("change", function (e) {
      type = e.target.selectedIndex;
      console.log("I'm a changed man!" + type);
      if (type == 1) {
        urlDiv.style.display = "block";
        thumbUrl.required = true;
        origninalUrl.required = true;
        altText.required = true;
      } else {
        urlDiv.style.display = "none";
        thumbUrl.required = false;
        origninalUrl.required = false;
        altText.required = false;
      }
    });

    albumForm.addEventListener("submit", function (e) {
      e.preventDefault();
      title = albumTitle.value;
      albumId = albumIdText.value;

      if (type == 0) {
        location = `internal`;
      } else {
        location = "external";
      }
      permalink = `/gallery/albums/${albumId}`;

      let fileDate = albumDate.value,
        time = albumTime.value;
      date = `${fileDate} ${time}:00 +0530`;
      let content = `---
layout: album
title: ${title}
album_id: ${albumId}
background: album
location: ${location}
permalink: ${permalink}
date: ${date}
categories: gallery album
---
`,
        filename = `${fileDate}-${albumId}.markdown`;
      createFile(content, filename);
      if (location == 1) {
        let externalContent = `- images:`;
        let thumbUrlList = thumbUrl.value.split("\n");
        let originalUrlList = origninalUrl.value.split("\n");
        let altTextList = altText.value.split("\n");
        for (i = 0; i < thumbUrlList.length; i++) {
          externalContent += `
  - thumb: "${thumbUrlList[i]}"
    full: "${originalUrlList[i]}"
    alt: "${altTextList[i]}"`
    
        }

        createFile(externalContent, `${albumId}.yml`);
      }
    });
  }
});

function createFile(content, filename) {
  // Create element with <a> tag
  const link = document.createElement("a");

  // Create a blog object with the file content which you want to add to the file
  const file = new Blob([content], { type: "text/plain" });

  // Add file content in the object URL
  link.href = URL.createObjectURL(file);

  // Add file name
  link.download = filename;

  // Add click event to <a> tag to save file.
  link.click();
  URL.revokeObjectURL(link.href);
}
