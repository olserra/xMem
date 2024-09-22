
export interface Video {
    id: number;
    title: string;
    url: string;
}

export interface Roadmap {
    title: string;
    videos: Video[];
}

export interface RoadmapData {
    [key: string]: {
        [key: string]: Roadmap;
    };
}

export const data: RoadmapData = {
    'software-engineering': {
        basic: {
            title: 'Software Engineering Skills',
            videos: [
                { id: 1, title: 'Next.js in 100 Seconds', url: 'https://www.youtube.com/embed/Sklc_fQBmcs' },
                { id: 2, title: '10 Design Patterns Explained', url: 'https://www.youtube.com/embed/tv-_1er1mWI' },
                { id: 3, title: 'Python for Beginners', url: 'https://www.youtube.com/embed/kqtD5dpn9C8' },
                { id: 4, title: 'Object-Oriented Programming', url: 'https://www.youtube.com/embed/SiBw7os-_zI' },
                { id: 5, title: 'Agile Methodology Explained', url: 'https://www.youtube.com/embed/8eVXTyIZ1Hs' },
                { id: 6, title: 'Testing in Software Engineering', url: 'https://www.youtube.com/embed/u6QfIXgjwGQ' },
                { id: 7, title: 'DevOps Concepts (CI/CD)', url: 'https://www.youtube.com/embed/scEDHsr3APg' },
                { id: 8, title: 'Version Control with Git', url: 'https://www.youtube.com/embed/hwP7WQkmECE' },
                { id: 9, title: 'Introduction to DevOps', url: 'https://www.youtube.com/embed/Me3ea4nUt0U' },
            ]
        },
    },
    'leadership': {
        basic: {
            title: 'Leadership Skills',
            videos: [
                { id: 1, title: 'Intro to Leadership Skills', url: 'https://www.youtube.com/embed/lti-4-QZmQc' },
                { id: 2, title: 'Leadership Presence', url: 'https://www.youtube.com/embed/2RBt2KVrRuY' },
                { id: 3, title: 'Emotional Intelligence', url: 'https://www.youtube.com/embed/Y7m9eNoB3NU' },
                { id: 4, title: 'Decision Making', url: 'https://www.youtube.com/embed/d7Jnmi2BkS8' },
                { id: 5, title: 'Building High-Performing Teams', url: 'https://www.youtube.com/embed/-ed7hNj8qOY' },
                { id: 6, title: 'Leadership Styles Explained', url: 'https://www.youtube.com/embed/RmqsV1293Rk' },
                { id: 7, title: 'Conflict Resolution', url: 'https://www.youtube.com/embed/2l-AOBz69KU' },
                { id: 8, title: 'Strategic Thinking', url: 'https://www.youtube.com/embed/AkgsYA-LYxo' },
                { id: 9, title: 'Leading Change', url: 'https://www.youtube.com/embed/pUmTQ-86-YI' },
            ],
        },
    },
    'analytical': {
        basic: {
            title: 'Analytical Skills',
            videos: [
                { id: 1, title: 'Intro to Analytical Skills', url: 'https://www.youtube.com/embed/1unUKmmM3WE' },
                { id: 2, title: 'Critical Thinking Skills', url: 'https://www.youtube.com/embed/dItUGF8GdTw' },
                { id: 3, title: 'Problem-Solving Techniques', url: 'https://www.youtube.com/embed/QOjTJAFyNrU' },
                { id: 4, title: 'Data Analysis Basics', url: 'https://www.youtube.com/embed/yZvFH7B6gKI' },
                { id: 5, title: 'Excel for Data Analysis', url: 'https://www.youtube.com/embed/_g5roKHj95o' },
                { id: 6, title: 'Statistical Analysis', url: 'https://www.youtube.com/embed/I10q6fjPxJ0' },
                { id: 7, title: 'Effective Research Methods', url: 'https://www.youtube.com/embed/YOppeXzFkBs' },
                { id: 8, title: 'Trends and Patterns', url: 'https://www.youtube.com/embed/ca0rDWo7IpI' },
                { id: 9, title: 'Hypotheses and Testing', url: 'https://www.youtube.com/embed/0oc49DyA3hU' },
            ],
        },
    },
    'creative': {
        basic: {
            title: 'Creative Skills',
            videos: [
                { id: 1, title: 'Intro to Creative Skills', url: 'https://www.youtube.com/embed/bEusrD8g-dM' },
                { id: 2, title: 'Boosting Creativity', url: 'https://www.youtube.com/embed/36L9cYkHyZM' },
                { id: 3, title: 'Creative Problem Solving', url: 'https://www.youtube.com/embed/kRtdcBfvixE' },
                { id: 4, title: 'Design Thinking Process', url: 'https://www.youtube.com/embed/_r0VX-aU_T8' },
                { id: 5, title: 'Innovative Thinking Techniques', url: 'https://www.youtube.com/embed/JpYA7WXkHyI' },
                { id: 6, title: 'The Creative Mindset', url: 'https://www.youtube.com/embed/C0XnjGQoCfw' },
                { id: 7, title: 'Brainstorming Effectively', url: 'https://www.youtube.com/embed/LuHx6KdQPHQ' },
                { id: 8, title: 'Generating New Ideas', url: 'https://www.youtube.com/embed/QRZ_l7cVzzU&t=4s' },
                { id: 9, title: 'Overcoming Creative Blocks', url: 'https://www.youtube.com/embed/Z057AO8CNRg' },
            ],
        },
    },
    'interpersonal': {
        basic: {
            title: 'Interpersonal Skills',
            videos: [
                { id: 1, title: 'Interpersonal Skills', url: 'https://www.youtube.com/embed/h5GB2GgDobbU' },
                { id: 2, title: 'Effective Communication', url: 'https://www.youtube.com/embed/I2i1Jikn1ws' },
                { id: 3, title: 'Building Relationships', url: 'https://www.youtube.com/embed/SpX_gmvo9wM' },
                { id: 4, title: 'Active Listening Skills', url: 'https://www.youtube.com/embed/uWsdmfT3jsY' },
                { id: 5, title: 'Empathy in Communication', url: 'https://www.youtube.com/embed/yXQdsSL3FaU' },
                { id: 6, title: 'Handling Difficult Conversations', url: 'https://www.youtube.com/embed/E5m2PjT24EI' },
                { id: 7, title: 'Assertiveness Training', url: 'https://www.youtube.com/embed/T2D9zfzz1r8' },
                { id: 8, title: 'Non-Verbal Communication', url: 'https://www.youtube.com/embed/UbNS6uOlmIo' },
                { id: 9, title: 'Conflict Resolution Skills', url: 'https://www.youtube.com/embed/S1YeCXxpBw0' },
            ],
        },
    },
    'artificial-intelligence': {
        basic: {
            title: 'Artificial Intelligence Skills',
            videos: [
                { id: 1, title: 'Intro to AI', url: 'https://www.youtube.com/embed/2ePf9rue1Ao' },
                { id: 2, title: 'Machine Learning Basics', url: 'https://www.youtube.com/embed/Gv9_4yMHFhI' },
                { id: 3, title: 'Deep Learning Introduction', url: 'https://www.youtube.com/embed/aircAruvnKk' },
                { id: 4, title: 'AI and Neural Networks', url: 'https://www.youtube.com/embed/8zAFcGKLgd8' },
                { id: 5, title: 'Natural Language Processing (NLP)', url: 'https://www.youtube.com/embed/Xc9UED00gx0' },
                { id: 6, title: 'AI in Computer Vision', url: 'https://www.youtube.com/embed/IGMJuqUefS4' },
                { id: 7, title: 'Reinforcement Learning', url: 'https://www.youtube.com/embed/kCc8FmEb1nY' },
                { id: 8, title: 'Ethics in AI', url: 'https://www.youtube.com/embed/Mr_UgLC-jRw' },
                { id: 9, title: 'AI in Healthcare', url: 'https://www.youtube.com/embed/oUo_TtPs56w' },
            ],
        },
    },
    'data-science': {
        basic: {
            title: 'Data Science Skills',
            videos: [
                { id: 1, title: 'Intro to Data Science', url: 'https://www.youtube.com/embed/ua-CiDNNj30' },
                { id: 2, title: 'Data Science Methodology', url: 'https://www.youtube.com/embed/d8jj9Qy-7TQ' },
                { id: 3, title: 'Python for Data Science', url: 'https://www.youtube.com/embed/GvjT7djtViQ' },
                { id: 4, title: 'Data Wrangling with Pandas', url: 'https://www.youtube.com/embed/5rnB-X9hNYM' },
                { id: 5, title: 'Exploratory Data Analysis', url: 'https://www.youtube.com/embed/r_tiiEKy2O0' },
                { id: 6, title: 'Data Visualization Techniques', url: 'https://www.youtube.com/embed/0c7OOawz32U' },
                { id: 7, title: 'Statistical Analysis for Data Science', url: 'https://www.youtube.com/embed/WGNTrj2c59A' },
                { id: 8, title: 'Machine Learning for Data Science', url: 'https://www.youtube.com/embed/7eh4d6sabA0' },
                { id: 9, title: 'Big Data Technologies', url: 'https://www.youtube.com/embed/bAyrObl7TYE' },
            ],
        },
    },
    'negotiation': {
        basic: {
            title: 'Negotiation Skills',
            videos: [
                { id: 1, title: 'Intro to Negotiation Skills', url: 'https://www.youtube.com/embed/9dU5bZtcP28' },
                { id: 2, title: 'Effective Negotiation Techniques', url: 'https://www.youtube.com/embed/x6m8D0hPpQw' },
                { id: 3, title: 'Building Win-Win Solutions', url: 'https://www.youtube.com/embed/5RtGbVxgC9A' },
                { id: 4, title: 'Preparing for Negotiations', url: 'https://www.youtube.com/embed/q2Nw1VVp9mI' },
                { id: 5, title: 'Negotiation Tactics and Strategies', url: 'https://www.youtube.com/embed/H7ZxWj7p_3Y' },
                { id: 6, title: 'Dealing with Difficult Negotiators', url: 'https://www.youtube.com/embed/WNvvO0ik7Cc' },
                { id: 7, title: 'Negotiating Salary and Benefits', url: 'https://www.youtube.com/embed/VWV0sFgUirE' },
                { id: 8, title: 'Cross-Cultural Negotiations', url: 'https://www.youtube.com/embed/Ks3egGzmB4M' },
                { id: 9, title: 'Negotiation Ethics', url: 'https://www.youtube.com/embed/Bl6ySPx_E2I' },
            ],
        },
    },
    'artistic': {
        basic: {
            title: 'Artistic Skills',
            videos: [
                { id: 1, title: 'Intro to Artistic Skills', url: 'https://www.youtube.com/embed/Nz5QsqAiE5Q' },
                { id: 2, title: 'Drawing Basics', url: 'https://www.youtube.com/embed/Rr3tV9IxtVk' },
                { id: 3, title: 'Painting Techniques', url: 'https://www.youtube.com/embed/kSDR0XWRnJU' },
                { id: 4, title: 'Digital Art Essentials', url: 'https://www.youtube.com/embed/QdLaJQhIQpM' },
                { id: 5, title: 'Sculpture Fundamentals', url: 'https://www.youtube.com/embed/5IvWFTxsv-s' },
                { id: 6, title: 'Photography Composition', url: 'https://www.youtube.com/embed/ntF7Q-zy2xY' },
                { id: 7, title: 'Art History Overview', url: 'https://www.youtube.com/embed/INl4d0qDQW4' },
                { id: 8, title: 'Graphic Design Basics', url: 'https://www.youtube.com/embed/lJ3EYNZp5T8' },
                { id: 9, title: 'Animating in Blender', url: 'https://www.youtube.com/embed/TPrnSACiTJ4' },
            ],
        },
    },
    'marketing': {
        basic: {
            title: 'Marketing Skills',
            videos: [
                { id: 1, title: 'Intro to Marketing Skills', url: 'https://www.youtube.com/embed/QOXsPKeIhWY' },
                { id: 2, title: 'Digital Marketing Basics', url: 'https://www.youtube.com/embed/OYCUtNEYU4A' },
                { id: 3, title: 'Content Marketing Strategies', url: 'https://www.youtube.com/embed/BLxJJ6wgGcU' },
                { id: 4, title: 'SEO Fundamentals', url: 'https://www.youtube.com/embed/KyFMU3KZpwc' },
                { id: 5, title: 'Social Media Marketing', url: 'https://www.youtube.com/embed/EHbMyI2Aw6g' },
                { id: 6, title: 'Email Marketing Campaigns', url: 'https://www.youtube.com/embed/pMCM4TGkUxc' },
                { id: 7, title: 'Branding Basics', url: 'https://www.youtube.com/embed/V5Hl3eTk0Dg' },
                { id: 8, title: 'Marketing Analytics', url: 'https://www.youtube.com/embed/TV-dlNf_Rdo' },
                { id: 9, title: 'Growth Hacking Techniques', url: 'https://www.youtube.com/embed/x4yUXsRDyZE' },
            ],
        },
    },
    'web3': {
        basic: {
            title: 'Web3 Skills',
            videos: [
                { id: 1, title: 'Intro to Web3 Technologies', url: 'https://www.youtube.com/embed/fWkxk5W1Rno' },
                { id: 2, title: 'Blockchain Basics', url: 'https://www.youtube.com/embed/SSo_EIwHSd4' },
                { id: 3, title: 'Decentralized Finance (DeFi)', url: 'https://www.youtube.com/embed/XxHH4-aQKDo' },
                { id: 4, title: 'Smart Contracts Explained', url: 'https://www.youtube.com/embed/pWGLtjG-F_o' },
                { id: 5, title: 'NFTs and Digital Assets', url: 'https://www.youtube.com/embed/8QL6YMGk3-0' },
                { id: 6, title: 'Ethereum Development', url: 'https://www.youtube.com/embed/IPKUBcvS_rg' },
                { id: 7, title: 'Building DApps', url: 'https://www.youtube.com/embed/8Cyoqg6tozI' },
                { id: 8, title: 'Cryptocurrency Trading', url: 'https://www.youtube.com/embed/QVxLbRFRlt8' },
                { id: 9, title: 'Web3 Security Best Practices', url: 'https://www.youtube.com/embed/vv49N5Qcn8s' },
            ],
        },
    },
};