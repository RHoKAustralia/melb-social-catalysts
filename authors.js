var fetch = require('./lib/fetch');

var SQL = 'select users.name as name, users.image as bioImage, users.slug as userSlug, users.image, posts.published_at, ' +
    'posts.title as lastPostTitle, posts.slug as lastPostSlug from roles_users, users, posts ' +
    'where roles_users.role_id = 3 and users.status = \'active\' and roles_users.user_id = users.id and ' +
    'users.id = posts.author_id group by users.name order by published_at desc limit 5';

var options = {
    dataLabel: 'writers',
    sqlStatement: SQL,
    processFunction: process,
    outputPath: 'ghost/content/themes/social-catalysts/assets/writers.json'
};

function process(writer) {
    return {
        name: writer.name,
        bioImage: writer.bioImage,
        url: '/author/' + writer.userSlug,
        lastPostTitle: writer.lastPostTitle,
        lastPostSlug: writer.lastPostSlug
    };
}

fetch.now(options);
