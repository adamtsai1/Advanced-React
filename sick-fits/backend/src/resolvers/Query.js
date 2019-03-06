const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),

    me(parent, args, ctx, info) {
        // Check if there is a current user ID
        if (!ctx.request.userId) {
            return null;
        }

        return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
    },

    async users(parent, args, ctx, info) {
        // 1. Check if the user is logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to perform this action.');
        }

        // 2. Check if the user has the permissions to query all the users
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        // 3. If they do, query all the users
        return ctx.db.query.users({}, info);
    },

    async order(parent, args, ctx, info) {
        // 1. Make sure they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to perform this action.');
        }

        // 2. Query the current order
        const order = await ctx.db.query.order(
            {
                where: {
                    id: args.id,
                },
            },
            info
        );

        // 3. Check if they have the permissions to see this order
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasAdminPermission = ctx.request.user.permissions.includes(
            'ADMIN'
        );

        if (!ownsOrder && !hasAdminPermission) {
            throw new Error('You are not authorized to view this record.');
        }

        // 4. Return the order
        return order;
    },

    async orders(parent, args, ctx, info) {
        // 1. Make sure they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to perform this action.');
        }

        // 2. Get orders
        const orderList = await ctx.db.query.orders({
            where: {
                user: { id: ctx.request.userId },
            },
        });

        // 3. Return orderList
        return orderList;
    },
};

module.exports = Query;
