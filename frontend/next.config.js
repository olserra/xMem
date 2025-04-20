/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    webpack: (config, { isServer }) => {
        // Add a rule to handle binary files
        config.module.rules.push({
            test: /\.node$/,
            use: 'node-loader'
        });

        // Add a rule to handle WASM files
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
        };

        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                buffer: false,
                util: false,
                url: false,
                assert: false,
                os: false,
                'process/browser': false,
            };
        }
        return config;
    },
}

module.exports = nextConfig
