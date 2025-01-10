import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = 'cm4lkdkwo000j64yrz2rpx35o'; // User ID for Otávio Serra

    // Data for seeding, where each paragraph becomes a memory entry
    const memories = [
        {
            text: "O usuário está desenvolvendo um projeto chamado Storyplay.xyz, que visa impactar crianças e seus pais por meio de uma plataforma de histórias personalizadas, com o objetivo de abordar temas relevantes como mudanças climáticas e habilidades como pensamento crítico. O projeto contará com uma base científica e psicológica, e a inclusão de psicólogos e PhDs em ciência cognitiva e educação para ajudar a criar a metodologia. Além disso, a plataforma terá avatares de personagens e recompensas como badges para as crianças, com elementos de gamificação e integrações entre o mundo físico e virtual, incluindo possíveis recursos em AR/VR no futuro. O projeto está no início e busca um modelo de negócio B2C e B2B, com foco em impacto educacional e psicológico.",
            labels: ["Projeto Educacional", "Gamificação", "Mudanças Climáticas"]
        },
        {
            text: "O usuário deseja que a interface de usuário do seu aplicativo seja simples e minimalista, mas com elementos coloridos que possam atrair a atenção das crianças sem parecer excessivamente lúdica ou parecida com desenho animado. Ele acredita que um bom designer seria mais necessário do que um engenheiro de jogos.",
            labels: ["Design", "UI/UX", "Atenção às Crianças"]
        },
        {
            text: "O usuário tem um TRX em casa e uma barra.",
            labels: ["Exercício", "TRX", "Equipamento"]
        },
        {
            text: "Otávio está considerando como oferecer soluções da xMEM para empresas, com foco em gerenciamento e compartilhamento de dados e conhecimento. Ele está refletindo sobre questões de armazenamento de dados em nuvem, privacidade e onde os dados seriam armazenados.",
            labels: ["xMEM", "Gestão de Dados", "Privacidade"]
        },
        {
            text: "Otávio is reflecting on the value of combining domain knowledge with AI fluency. He acknowledges that while AI democratizes programming capabilities, deep technical expertise is still essential. He wants to create a roadmap to improve in effectively using AI as a force multiplier for solving complex technical problems.",
            labels: ["AI Fluency", "Domain Knowledge", "Problem Solving"]
        },
        {
            text: "Otávio wants to explore combining domain knowledge with AI fluency through his startup xMEM.xyz. He envisions developing features that allow him to practice and learn the skills mentioned in his roadmap, integrating technical expertise with AI for real-world applications.",
            labels: ["Startup", "AI Integration", "Technical Expertise"]
        },
        {
            text: "O usuário deseja trabalhar em não levar as coisas para o lado pessoal, treinando o seu *self* para ter mais autocontrole e resiliência emocional no dia a dia. Ele quer receber ajuda para desenvolver essa habilidade ao longo do tempo.",
            labels: ["Autocontrole", "Resiliência", "Crescimento Pessoal"]
        },
        {
            text: "O usuário se separou de Carolina Barreira Lins.",
            labels: ["Relações Pessoais", "Separação", "Vida Pessoal"]
        },
        {
            text: "O usuário trabalha na Roche como Product Manager em um projeto chamado boost/eLN, que interage com Signals, e também atua como DevOps. Ele ainda utiliza Python, AWS, GitLab e DevOps, mas agora está focado em destacar sua experiência técnica e seu trabalho na integração do CIDM e eLN do ponto de vista de produto, com o objetivo de transitar para uma carreira como AI Product Manager.",
            labels: ["Roche", "Product Manager", "DevOps"]
        },
        {
            text: "O usuário está ajustando seu scraper e o cron para obter preços, percentuais de crescimento em intervalos de 1h, 24h e 7d, volume de mercado e outras métricas para o projeto de recomendações de ICOs/IDOs.",
            labels: ["Scraping", "ICO", "Métricas"]
        },
        {
            text: "O usuário está usando Next.js com TypeScript no projeto atual.",
            labels: ["Next.js", "TypeScript", "Tecnologia"]
        },
        {
            text: "O usuário está ajustando seu scraper e o cron para obter dados da URL https://coinmarketcap.com/view/memes/. Ele não deseja armazenar as informações na base de dados, mas sim fazer scraping direto dessa URL para obter preços, percentuais de crescimento em intervalos de 1h, 24h, e 7d, volume de mercado e outras métricas.",
            labels: ["Scraping", "CoinMarketCap", "Dados em Tempo Real"]
        },
        {
            text: "O usuário está utilizando a funcionalidade de cron jobs da Vercel para acionar rotas de API periodicamente.",
            labels: ["Cron Jobs", "Vercel", "Automação"]
        },
        {
            text: "O usuário tem um domínio chamado openskills.online, onde está desenvolvendo um MVP.",
            labels: ["OpenSkills", "MVP", "Desenvolvimento"]
        },
        {
            text: "O usuário está considerando focar em recomendações para ICOs/IDOs, fornecendo insights sobre novas criptomoedas e tokens. Ele deseja criar um projeto em Next.js com TypeScript e Tailwind, com uma interface moderna alinhada com o mercado de cripto, usando a tag Image do Next.js e imagens hospedadas no Google. Ele também quer usar o pnpm.",
            labels: ["ICO", "Criptomoeda", "Next.js"]
        },
        {
            text: "O usuário está desenvolvendo um projeto em Next.js, usando TypeScript e Tailwind, focado em uma landing page para recomendações de ICOs/IDOs em criptomoedas. Ele está utilizando o pnpm como gerenciador de pacotes e o Prisma para a base de dados relacional. Ele prefere que as interfaces globais sejam colocadas em um arquivo chamado `type.d.ts` e quer uma UI moderna alinhada com o estilo comum no mercado de cripto. Para imagens, ele deseja usar a tag `Image` do Next.js com fontes do Google.",
            labels: ["Next.js", "TypeScript", "UI Moderna"]
        },
        {
            text: "O usuário não está mais usando o Windows OS para codificar, apenas o WSL2 com o terminal do Windows, e atualmente usa o Zsh.",
            labels: ["WSL2", "Zsh", "Desenvolvimento"]
        },
        {
            text: "O usuário geralmente corre 20 minutos, o que dá cerca de 3 quilômetros.",
            labels: ["Exercício", "Corrida", "Saúde"]
        },
        {
            text: "O usuário deseja lembrar problemas, validações, stack e informações úteis relacionadas ao aplicativo OpenSkills.",
            labels: ["OpenSkills", "Stack", "Problemas"]
        },
        {
            text: "O usuário não se preocupa com os IDs das habilidades em seu aplicativo OpenSkills, apenas com os nomes das habilidades.",
            labels: ["OpenSkills", "Habilidades", "IDs"]
        },
        {
            text: "O usuário está começando um novo empreendimento chamado 'pulse'.",
            labels: ["Pulse", "Empreendedorismo", "Novo Negócio"]
        },
        {
            text: "O usuário deseja que o conteúdo de suas constantes seja adaptado apenas em relação ao aplicativo 'pulse' sem mudar os outros elementos.",
            labels: ["Pulse", "Conteúdo", "Personalização"]
        },
        {
            text: "O usuário está pensando em criar uma startup que ajude as pessoas a aprender e melhorar suas habilidades em IA, considerando a utilização de LLMs ou flashcards como métodos de aprendizado. Ele está construindo o MVP e busca algo simples e eficaz.",
            labels: ["Startup", "IA", "MVP"]
        },
        {
            text: "O usuário está pensando sobre o tema do seu projeto, considerando que a inteligência artificial é um tema que veio para ficar e está em expansão. Ele está avaliando se as pessoas que desejam aprender ou melhorar suas habilidades em AI estariam dispostas a pagar por uma plataforma com flashcards e um tutor de AI, e se o público que se prepara para concursos públicos seria mais propenso a pagar do que estudantes de AI.",
            labels: ["AI", "Flashcards", "Monetização"]
        },
        {
            text: "O usuário está considerando focar em clientes B2B para seu aplicativo de aprendizado em inteligência artificial.",
            labels: ["B2B", "IA", "Clientes"]
        },
        {
            text: "O usuário está focando na criação de um LMS (Learning Management System) para empresas com um sistema inovador e gamificado.",
            labels: ["LMS", "Gamificação", "Educação"]
        },
    ];

    // Seed Memory
    for (const memory of memories) {
        try {
            await prisma.memory.create({
                data: {
                    userId: userId,
                    data: {
                        text: memory.text,
                        labels: memory.labels,
                    },
                },
            });
        } catch (error) {
            console.error('Error while seeding:', error);
        }
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch(e => {
        console.error('Error during seeding:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
