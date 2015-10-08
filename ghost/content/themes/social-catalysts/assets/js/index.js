(function ($) {
    "use strict";

    /*------ tags ----------------------------------------------------------------------------*/

    var tagsCache = null;

    function createTag(tag) {
        return [
            '<a href="', encodeURIComponent(tag.url), '" class="tags-item">', tag.name, '</a>'
        ].join('');
    }

    function processTagsElement(selector) {
        var tagsEl = $(selector);
        var tagItemsEl = tagsCache.map(createTag);
        tagsEl.html(tagItemsEl);
    }

    function processTagsIntoElements() {
        ['.footer-tags', '.tags-main-list'].forEach(processTagsElement)
    }

    var TagsLoaded = new Event('TagsLoaded');
    window.document.addEventListener('TagsLoaded', processTagsIntoElements);

    function triggerTagsLoaded(tags) {
        tagsCache = tags;
        window.document.dispatchEvent(TagsLoaded);
    }

    /*------ authors ---------------------------------------------------------------------------*/

    var writersCache = null;

    function createWriter(writer) {
        var htmlStart = [
            '<div class="writer">',
            '<div class="writer-name"><a href="',
            writer.url,
            '">',
            writer.name,
            '</a></div>',
            '<div class="writer-last-post">',
            '<a href="/',
            encodeURIComponent(writer.lastPostSlug),
            '">',
            writer.lastPostTitle,
            '</a></div>'
        ];

        var htmlImage = [
            '<a href="',
            writer.url,
            '">',
            '<div class="writer-image" ><img src="',
            writer.bioImage,
            '"/></div></a>',
        ];

        var htmlEnd = [
            '</div>'
        ];

        if (writer.bioImage) {
            return htmlStart.concat(htmlImage, htmlEnd).join('');
        } else {
            return htmlStart.concat(htmlEnd).join('');
        }
    }

    function processWritersElement(selector) {
        var writersEl = $(selector);
        var writersItemsEl = writersCache.map(createWriter);
        writersEl.html(['<div class="writers-list-heading">Featured Writers</div>'].concat(writersItemsEl));
    }

    function processWritersIntoElements() {
        ['.writers-list'].forEach(processWritersElement)
    }

    var WritersLoaded = new Event('WritersLoaded');
    window.document.addEventListener('WritersLoaded', processWritersIntoElements);

    function triggerWritersLoaded(writers) {
        writersCache = writers;
        window.document.dispatchEvent(WritersLoaded);
    }

    /*------------------------------------------------------------------------------------------*/

    function fetchAll(urls) {
        doFetch(urls.tagsUrl, triggerTagsLoaded);
        doFetch(urls.writersUrl, triggerWritersLoaded);
    }

    function doFetch(url, callback) {
        $.ajax({
            dataType: 'json',
            method: 'get',
            url: url,
            success: callback
        });
    }

    window.sc = {
        utils: {
            fetchSideBarItems: fetchAll
        }
    };

}(jQuery));
