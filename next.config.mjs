// next.config.mjs
export default {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:5000/:path*', // Proxy to Flask server
            },
        ];
    },
};
