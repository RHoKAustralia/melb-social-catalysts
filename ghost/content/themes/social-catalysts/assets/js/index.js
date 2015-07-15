(function ($) {
    "use strict";

    var tagsCache = null;

    function createTag(tag) {
        return [
            '<a href="', tag.url, '" class="tags-item">', tag.name, '</a>'
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
        console.log('loaded', tagsCache);
        window.document.dispatchEvent(TagsLoaded);
    }

    function fetchTags(tagsUrl) {
        $.ajax({
            dataType: 'json',
            method: 'get',
            url: tagsUrl,
            success: triggerTagsLoaded

        });
    }

    window.sc = {
        utils: {
            fetchTags: fetchTags
        }
    };

}(jQuery));
