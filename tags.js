var fetch = require('./lib/fetch');

var SQL = 'select distinct tags.name, tags.slug, posts.published_at as last_published_at ' +
    'from tags, posts, posts_tags ' +
    'where tags.id = posts_tags.tag_id and posts.id = posts_tags.post_id ' +
    'group by tags.name, tags.slug ' +
    'order by last_published_at desc';

var options = {
    dataLabel: 'tags',
    sqlStatement: SQL,
    processFunction: process,
    outputPath: 'ghost/content/themes/social-catalysts/assets/tags.json'
};

function process(tag) {
    return {
        name: tag.name,
        url: '/tag/' + tag.slug
    };
}

fetch.now(options);
