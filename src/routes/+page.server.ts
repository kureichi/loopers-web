import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '#lib/server/auth.ts';
import Ball from '#lib/server/db/models/ball.ts';
import { isYesterday } from '#lib/utils.js';
import SearchHistory from '#lib/server/db/models/searchHistory.ts';

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        return redirect(302, '/login');
    }

    const now = new Date();

    let ball = await Ball.findOne({ userId: event.locals.user.id }).lean();
    if (!ball) {
        const newBall = await Ball.create({
            userId: event.locals.user.id,
            count: 0,
            updatedAt: now
        });

        ball = newBall.toObject();
    }

    let searchHistory = await SearchHistory.findOne({ userId: event.locals.user.id }).lean();
    if (!searchHistory) {
        const newSearchHistory = await SearchHistory.create({
            userId: event.locals.user.id
        });

        searchHistory = newSearchHistory.toObject();
    }

    return {
        user: event.locals.user,
        ball: {
            ...ball,
            _id: ball._id.toString()
        },
        now,
        isClaimed: !isYesterday(ball.updatedAt, now),
        searchHistory: {
            ...searchHistory,
            _id: searchHistory._id.toString()
        }
    };
};

export const actions: Actions = {
    signOut: async (event) => {
        await auth.api.signOut({
            headers: event.request.headers
        });
        return redirect(302, '/login');
    },
    push: async (event) => {
        const ball = await Ball.findOne({ userId: event.locals.user?.id }).lean();
        if (!ball) return redirect(302, '?/signOut');
        if (!isYesterday(ball.updatedAt, new Date())) {
            return redirect(403, '/');
        }

        await Ball.updateOne(
            { userId: event.locals.user?.id },
            {
                count: ball?.count + 1,
                updatedAt: new Date()
            }
        );

        return redirect(302, '/');
    },
    reset: async (event) => {
        const ball = await Ball.findOne({ userId: event.locals.user?.id }).lean();
        if (!ball) return redirect(302, '?/signOut');

        await Ball.updateOne(
            { userId: event.locals.user?.id },
            {
                count: 0,
                updatedAt: new Date(),
                createdAt: new Date()
            }
        );

        return redirect(302, '/');
    },
    submitSearch: async (event) => {
        const searchHistory = await SearchHistory.findOne({ userId: event.locals.user?.id }).lean();
        if (!searchHistory) return redirect(302, '?/signOut');

        const formData = await event.request.formData();
        const query = String(formData.get('query') || '').trim();
        if (!query) return redirect(302, '/');

        const done = () => {
            return redirect(302, `https://www.google.com/search?q=${encodeURIComponent(query)}`, {
                external: true
            });
        };

        if (searchHistory.history.includes(query)) {
            return done();
        }

        await SearchHistory.updateOne(
            { userId: event.locals.user?.id },
            {
                history: [query, ...searchHistory.history]
            }
        );

        return done();
    }
};
