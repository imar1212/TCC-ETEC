-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 03/12/2025 às 02:06
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `bd`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `conteudo`
--

CREATE TABLE `conteudo` (
  `Id_conteudo` int(11) NOT NULL,
  `Titulo` varchar(100) NOT NULL,
  `Resumo` text NOT NULL,
  `Conteudo` longtext NOT NULL,
  `Data` datetime NOT NULL,
  `Status` enum('ativo','inativo') NOT NULL,
  `Imagem` varchar(700) DEFAULT NULL,
  `Tipo` enum('educacao','saude','noticias','depoimento','suporte','cultura') NOT NULL,
  `Fk_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `conteudo`
--

INSERT INTO `conteudo` (`Id_conteudo`, `Titulo`, `Resumo`, `Conteudo`, `Data`, `Status`, `Imagem`, `Tipo`, `Fk_usuario`) VALUES
(5, 'Comunidade LGBT: Um Breve Panorama', 'O texto explica que a comunidade LGBT é formada por pessoas com diferentes orientações sexuais e identidades de gênero, que historicamente enfrentaram discriminação. Destaca os avanços conquistados em direitos civis e igualdade, assim como os desafios ainda existentes, como estigmatização e desigualdade. O foco é na importância do respeito, inclusão e reconhecimento da diversidade para uma sociedade mais justa.', 'A comunidade LGBT (Lésbicas, Gays, Bissexuais, Transgêneros e outras identidades de gênero e orientações sexuais) é formada por pessoas que desafiam normas tradicionais de gênero e sexualidade. Essa diversidade engloba múltiplas identidades, incluindo queer, intersexo e não binário, refletindo a complexidade da experiência humana.\r\n\r\nHistoricamente, pessoas LGBT enfrentaram discriminação, marginalização e violência em diversas sociedades. Movimentos sociais ao longo do século XX e XXI lutaram por direitos civis, igualdade legal, reconhecimento social e proteção contra preconceitos, resultando em avanços como o casamento igualitário, leis anti-discriminação e maior visibilidade cultural.\r\n\r\nA comunidade também promove espaços de apoio, cultura e educação, buscando aceitação e inclusão. Apesar dos avanços, desafios persistem, incluindo estigmatização, desigualdade econômica e barreiras ao acesso à saúde adequada, especialmente para pessoas trans.\r\n\r\nReconhecer e respeitar a diversidade LGBT é essencial para sociedades mais justas e igualitárias, promovendo dignidade, direitos humanos e inclusão para todos.', '2025-10-26 14:17:54', 'ativo', '/uploads/conteudos/1761499375906-550077185.jpg', 'educacao', 52),
(6, '“O Mágico de Oz” e a Comunidade LGBT: Um Ícone Cultural e Símbolo de Aceitação', 'Dorothy e seus amigos não estão apenas no Mágico de Oz, eles se tornaram um símbolo de coragem, amizade e identidade para a comunidade LGBT.', '“O Mágico de Oz”, escrito por L. Frank Baum e eternizado no cinema em 1939, é uma obra que, à primeira vista, parece destinada ao público infantil. No entanto, sua relevância transcende gerações e gêneros, tornando-se um ícone cultural com significados profundos para a comunidade LGBT. A história acompanha Dorothy, uma jovem transportada para a mágica Terra de Oz, onde embarca em uma jornada ao lado do Espantalho, do Homem de Lata e do Leão Covarde. Cada personagem simboliza aspectos humanos essenciais: coragem, amor, inteligência e perseverança. Mas há algo mais por trás dessa narrativa encantadora: uma mensagem de aceitação, pertencimento e autodescoberta que ressoou profundamente na comunidade LGBT ao longo das décadas.\r\n\r\n\r\nDurante os anos 1940 e 1950, quando a homossexualidade era amplamente marginalizada e perseguida, surgia nos Estados Unidos a expressão “amigos da Dorothy”. Essa frase funcionava como um código secreto entre pessoas LGBTQ+, permitindo que se reconhecessem e se conectassem em tempos de repressão. Dorothy, com sua bondade, coragem e determinação para encontrar um lar, tornou-se símbolo de identificação. Assim, Oz e sua história ganharam uma dimensão simbólica: a Terra de Oz representava um lugar seguro, inclusivo, onde ser diferente era aceito e onde cada indivíduo podia expressar sua verdadeira identidade sem medo.\r\n\r\nO impacto cultural de “O Mágico de Oz” na comunidade LGBT vai além do apelido “amigos da Dorothy”. A narrativa reforça a ideia de que a diversidade e a singularidade são qualidades a serem celebradas. A jornada de Dorothy e de seus amigos ensina sobre solidariedade, empatia e superação de obstáculos, conceitos que ecoam na luta pela igualdade e pelos direitos civis da comunidade. Mais do que entretenimento, a obra de Baum passou a ser um símbolo de esperança, mostrando que é possível construir relações de apoio e encontrar força mesmo em situações adversas.\r\n\r\n\r\nAlém disso, o filme e a história têm sido referência constante em discussões sobre identidade de gênero, expressão individual e resistência contra normas sociais rígidas. Personagens como Dorothy e o Espantalho, que desafiam expectativas e encontram soluções criativas para seus dilemas, servem como metáforas poderosas para experiências vividas por pessoas LGBT. A narrativa reforça que cada indivíduo tem valor intrínseco, independentemente das expectativas externas, e que a verdadeira coragem está em ser autêntico.\r\n\r\nEm tempos modernos, “O Mágico de Oz” continua a inspirar artistas, escritores e ativistas da comunidade LGBT, consolidando seu papel não apenas como um clássico da literatura e do cinema, mas também como um símbolo de resistência cultural. A obra mostra que histórias aparentemente infantis podem carregar mensagens profundas de aceitação, coragem e pertencimento, oferecendo um farol de esperança para aqueles que buscam ser reconhecidos e respeitados em sua verdadeira identidade.\r\n\r\n“O Mágico de Oz” é muito mais do que uma simples fantasia. Ele representa a busca por identidade, segurança e aceitação, valores centrais para a comunidade LGBT. A expressão “amigos da Dorothy” encapsula essa relação histórica, mostrando como a cultura pop pode se tornar um espaço de solidariedade e referência. A obra nos lembra que, assim como Dorothy encontrou seu caminho de volta para casa, todos têm o direito de encontrar um lugar onde possam ser autênticos, celebrando a diversidade e a humanidade em sua forma mais plena.', '2025-10-26 14:35:36', 'ativo', '/uploads/conteudos/1761500136938-744676341.png', 'cultura', 52),
(8, 'CVV – Centro de Valorização da Vida: Apoio Emocional e Prevenção do Suicídio', 'O Centro de Valorização da Vida (CVV) é uma organização sem fins lucrativos que oferece apoio emocional e prevenção do suicídio de forma gratuita, voluntária e sigilosa.', 'Fundado em São Paulo em 1962, o CVV – Centro de Valorização da Vida é um serviço voluntário gratuito de apoio emocional e prevenção do suicídio para todas as pessoas que querem e precisam conversar, sob total sigilo e anonimato.\r\n\r\nOferece atendimento pelo telefone 188 (24 horas e sem custo de ligação), por chat, e-mail e pessoalmente.  Nestes canais, são feitos mais de 2,7 milhões de atendimentos anuais, por aproximadamente 3.300 voluntários, presentes em 20 estados, além do Distrito Federal.\r\n\r\nÉ uma associação civil sem fins lucrativos, filantrópica, que é reconhecida como de Utilidade Pública Federal desde 1973. A instituição é associada ao Befrienders Worldwide, que congrega entidades congêneres de todo o mundo, e participou da força-tarefa que elaborou a Política Nacional de Prevenção do Suicídio, do Ministério da Saúde, com quem mantém, desde 2015, um acordo de cooperação que permitiu a implantação do 188, linha nacional gratuita de prevenção do suicídio.\r\n\r\nAlém dos atendimentos, o CVV desenvolve, em todo o país, outras atividades relacionadas à prevenção do suicídio, com ações abertas à comunidade que estimulam o autoconhecimento e a melhor convivência em grupo e consigo mesmo.\r\n\r\nA  instituição também mantém o Hospital Francisca Júlia, que atende pessoas com transtornos mentais e dependência química em São José dos Campos (SP). Para conhecer mais, clique abaixo e visite o site oficial.', '2025-10-30 23:46:25', 'ativo', '/uploads/conteudos/1761878927843-29069654.jpg', 'saude', 52),
(9, 'Erika Hilton', 'Erika Hilton, nascida em 1992 em São Paulo, é ativista, mulher trans e deputada federal pelo PSOL. Superou uma infância marcada por preconceito e se tornou a primeira mulher trans eleita para a Câmara Municipal de São Paulo. Hoje, atua na defesa dos direitos humanos, igualdade de gênero, raça e diversidade.', 'Infância e primeiros desafios\r\n\r\nErika Hilton nasceu em 9 de dezembro de 1992 em Franco da Rocha, na Região Metropolitana de São Paulo, e passou boa parte da infância em Francisco Morato. \r\n\r\nMesmo cercada por familiares que a apoiavam, desde jovem viveu situações de hostilidade por ser uma pessoa trans. \r\n\r\nAos 14 anos, a situação se agravou: dormiu nas ruas, trabalhou com prostituição como estratégia de sobrevivência, enfrentando a marginalização vivida por muitas travestis periféricas no país. \r\n\r\nEducação e entrada na militância\r\n\r\nErika conseguiu retomar os estudos, fez curso pré-vestibular para pessoas trans e começou a cursar pedagogia (e gerontologia) na Universidade Federal de São Carlos. \r\n\r\nNesse ambiente universitário se engajou em ativismo por direitos de pessoas trans e LGBTQIA+ e percebeu a importância de ocupar espaços institucionais. \r\n\r\nCaminho para a política\r\n\r\nO ativismo de Erika ganhou visibilidade quando, em 2015, ela protagonizou uma petição contra uma empresa de ônibus em Itu que se recusou a registrar seu nome social. \r\n\r\nIsso a levou a entrar no Partido Socialismo e Liberdade (PSOL) e, em 2016, candidatar-se à vereadora em Itu — sem êxito naquele pleito. \r\n\r\nEm 2018, integrou a chamada “Bancada Ativista” na Assembleia Legislativa do Estado de São Paulo (ALESP) em mandato coletivo. \r\n\r\nEleições históricas\r\n\r\nNas eleições municipais de 2020, Erika foi eleita vereadora da São Paulo com 50.508 votos, tornando-se a primeira mulher trans eleita para a Câmara Municipal de São Paulo e a mulher que mais votos recebeu naquele pleito. \r\n\r\nEm 2022, foi eleita deputada federal pelo estado de São Paulo com cerca de 256.903 votos, e assumiu o mandato em 1º de fevereiro de 2023. \r\n\r\nComo parlamentar, Erika Hilton tem dado prioridade a temas como direitos da população LGBTQIA+, combate ao racismo, inclusão social de pessoas trans e travestis, segurança alimentar e políticas públicas para população em situação de vulnerabilidade. \r\n\r\nPor exemplo, durante seu mandato como vereadora, foi autora de projeto que criou o Fundo Municipal de Combate à Fome. \r\n\r\nReconhecimento e desafios\r\n\r\nErika conquistou visibilidade internacional: em 2022 foi eleita pela BBC como uma das “100 Mulheres Mais Inspiradoras do Mundo”. \r\n\r\nNo entanto, continua a enfrentar episódios de transfobia, racismo e hostilidade, inclusive em situações diplomáticas — por exemplo, em 2025 denunciou que um visto emitido pelos Estados Unidos a identificou como “sexo masculino”. \r\n\r\nSignificado e legado\r\n\r\nA trajetória de Erika Hilton simboliza a interseção entre raça, periferia, gênero e orientação sexual na política brasileira. Ela representa um corpo que historicamente foi marginalizado e, por meio da educação, militância e ocupação de espaços de poder, busca abrir caminhos para que outras pessoas trans, negras e periféricas também o façam. Como ela própria disse: “Que meu corpo sirva para abrir caminhos para que outras possam vir”.', '2025-10-30 23:57:44', 'ativo', '/uploads/conteudos/1761879464437-573252486.jpg', 'depoimento', 52),
(10, 'Ativista cria centro de apoio a pessoas transexuais em Jundiaí', 'Um ativista da causa trans criou o CAIS – Centro de Apoio e Inclusão Social para Travestis e Transexuais para dar suporte a pessoas transexuais e travestis que enfrentam violência e preconceito, oferecendo ações sociais, empregabilidade e tratamento hormonal.', 'Um centro de apoio e inclusão social para travestis e transexuais foi inaugurado em Jundiaí com o objetivo de oferecer suporte emocional, social e profissional a pessoas trans que enfrentam preconceito e violência. A iniciativa, liderada por um ativista da causa LGBT+, busca promover a inclusão e a dignidade de indivíduos que muitas vezes são marginalizados pela sociedade.\r\n\r\nAções e serviços oferecidos\r\n\r\nO centro oferece orientação sobre direitos, apoio psicológico, consultoria para empregabilidade e informações sobre tratamento hormonal e procedimentos médicos, contribuindo para o bem-estar e autonomia das pessoas transexuais e travestis. O espaço também realiza workshops, rodas de conversa e campanhas de conscientização, com foco na redução da discriminação e no fortalecimento da comunidade.\r\n\r\nImportância social\r\n\r\nSegundo o fundador, o projeto nasceu da necessidade de combater a exclusão e a violência que ainda atingem a população trans. “Muitas pessoas transexuais sofrem violência em casa, na rua e no trabalho. O centro é um espaço seguro para que possam se acolher, aprender e se empoderar”, afirmou.\r\n\r\nImpacto e expectativas\r\n\r\nA iniciativa é um exemplo de ativismo comunitário, mostrando como ações locais podem gerar mudanças significativas na vida de pessoas marginalizadas. O centro já tem recebido demanda crescente, reforçando a importância de políticas e espaços voltados à inclusão e proteção da população trans.', '2025-10-31 00:02:28', 'ativo', '/uploads/conteudos/1761879748009-473237148.jpg', 'noticias', 52);

-- --------------------------------------------------------

--
-- Estrutura para tabela `denuncia`
--

CREATE TABLE `denuncia` (
  `Id_denuncia` int(11) NOT NULL,
  `Motivo` varchar(100) NOT NULL,
  `Alvo` enum('perfil','desabafo','resposta') NOT NULL,
  `Fk_usuario` int(11) DEFAULT NULL,
  `Fk_desabafo` int(11) DEFAULT NULL,
  `Fk_resposta` int(11) DEFAULT NULL,
  `Denunciado_por` int(11) DEFAULT NULL,
  `Descricao` text DEFAULT NULL,
  `Data` datetime NOT NULL,
  `Status` enum('pendente','resolvida','arquivada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `desabafo`
--

CREATE TABLE `desabafo` (
  `Id_desabafo` int(11) NOT NULL,
  `Texto` text NOT NULL,
  `Data` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Status` enum('aprovado','negado','pendente') NOT NULL,
  `Fk_usuario` int(11) NOT NULL,
  `Anonimo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `desabafo`
--

INSERT INTO `desabafo` (`Id_desabafo`, `Texto`, `Data`, `Status`, `Fk_usuario`, `Anonimo`) VALUES
(31, 'Ganhe dinheiro fácil agora! Clique neste link e descubra o segredo para ficar rico em 3 dias!!! 💸🔥 👉 htttp://link.suspeito.com', '2025-10-30 06:48:05', 'aprovado', 55, 1),
(32, 'Contar pros meus amigos que sou bissexual foi libertador, mas ao mesmo tempo cansativo. Todo mundo parece querer uma explicação, como se eu precisasse provar que gosto de mais de um gênero. Às vezes só queria que entendessem: eu sou assim, e tá tudo bem', '2025-10-30 06:34:03', 'aprovado', 54, 0),
(33, 'Às vezes sinto que estou sempre me escondendo. Não porque quero, mas porque tenho medo do que meus pais vão dizer se souberem que gosto de meninas. Já ouvi tantas piadas homofóbicas em casa que não consigo imaginar uma conversa sincera sobre mim. Queria poder só existir sem medo.', '2025-10-30 06:12:57', 'pendente', 53, 1),
(34, 'Crescer sendo uma pessoa trans em uma cidade pequena é como viver em um lugar onde ninguém fala a sua língua. Me sinto invisível a maior parte do tempo. Mas, quando encontro alguém que entende, é como se o mundo ficasse mais leve, mesmo que por um instante', '2025-10-30 06:31:34', 'aprovado', 53, 0),
(36, 'Demorou muito pra eu me olhar no espelho e gostar do que vejo. Hoje me sinto mais eu do que nunca. Ainda tem medo, ainda tem preconceito, mas também tem orgulho. E isso é o que me faz continuar', '2025-10-30 06:33:41', 'aprovado', 55, 1),
(37, 'Às vezes me sinto perdida. Gosto de meninos, mas também gosto de meninas — e às vezes parece que o mundo quer que eu escolha um lado. Mas e se eu não quiser escolher? E se só quiser viver e amar quem me faz bem?', '2025-10-30 06:33:51', 'aprovado', 56, 0),
(39, 'Tentei contar pra minha mãe que estou namorando uma garota. Ela ficou em silêncio por um tempo e depois fingiu que não ouviu. É triste perceber que o amor da gente pode ser ignorado como se fosse nada.', '2025-10-30 06:51:47', 'aprovado', 54, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `humor`
--

CREATE TABLE `humor` (
  `id_humor` int(11) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `descricao` text NOT NULL,
  `escala` int(11) NOT NULL,
  `icone` varchar(100) NOT NULL,
  `status` enum('ativo','inativo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `humor`
--

INSERT INTO `humor` (`id_humor`, `nome`, `descricao`, `escala`, `icone`, `status`) VALUES
(5, 'Feliz', 'Sentimento de bem-estar, alegria e satisfação, onde a pessoa se sente realizada e leve.', 4, '/feliz.png', 'ativo'),
(6, 'Chocado', 'Reação intensa e repentina a algo inesperado, muitas vezes negativo, que provoca forte impacto emocional.', 1, '/chocado.png', 'ativo'),
(9, 'Entusiasmado', 'Emoção vibrante, cheia de energia e motivação, marcada por grande otimismo e vontade de agir.', 5, '/entusiasmado.png', 'ativo'),
(11, 'Tímido', 'Leve desconforto social, mas sem sofrimento intenso.', 3, '/timido.png', 'ativo'),
(12, 'Irritado', 'Emoção intensa de frustração/raiva, gera reações impulsivas.', 1, '/irritado.png', 'ativo'),
(13, 'Medroso', 'Insegurança e alerta, desagradável, porém útil à sobrevivência.', 2, '/medroso.png', 'ativo'),
(14, 'Apático', 'Falta de interesse ou motivação, mais indiferente que doloroso.', 3, '/apatico.png', 'ativo'),
(15, 'Neutro', 'Ausência de polarização emocional.', 3, '/neutro.png', 'ativo'),
(16, 'Triste', 'Sofrimento ligado à perda ou desalento.', 1, '/triste.png', 'ativo'),
(17, 'Orgulhoso', 'Estado de autoestima elevada e valorização pessoal, geralmente ligado a conquistas ou reconhecimento.', 5, '/orgulhoso.png', 'ativo');

-- --------------------------------------------------------

--
-- Estrutura para tabela `interacao`
--

CREATE TABLE `interacao` (
  `Id_interacao` int(11) NOT NULL,
  `Tipo` enum('comentario','curtida') NOT NULL,
  `Status` enum('ativo','inativo','pendente') NOT NULL,
  `Data` datetime NOT NULL,
  `Fk_desabafo` int(11) NOT NULL,
  `Fk_usuario` int(11) NOT NULL,
  `text` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `interacao`
--

INSERT INTO `interacao` (`Id_interacao`, `Tipo`, `Status`, `Data`, `Fk_desabafo`, `Fk_usuario`, `text`) VALUES
(151, 'comentario', 'ativo', '2025-10-30 06:35:45', 32, 53, 'Não precisa provar nada pra ninguém. Ser bissexual não é confusão, não é fase, e muito menos algo que precise de justificativa. Você não deve explicações sobre quem é ou quem ama. O importante é estar em paz com você mesma — o resto é aprendizado dos outros, não um fardo seu.'),
(152, 'curtida', 'ativo', '2025-10-30 06:36:43', 32, 53, NULL),
(153, 'curtida', 'ativo', '2025-10-30 06:36:48', 36, 53, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pronome`
--

CREATE TABLE `pronome` (
  `Id_pronome` int(11) NOT NULL,
  `Pronome` enum('ela/dela','ele/dele','elu/delu') NOT NULL,
  `Fk_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pronome`
--

INSERT INTO `pronome` (`Id_pronome`, `Pronome`, `Fk_usuario`) VALUES
(94, 'ele/dele', 54),
(95, 'ele/dele', 52),
(96, 'ela/dela', 53);

-- --------------------------------------------------------

--
-- Estrutura para tabela `punicao`
--

CREATE TABLE `punicao` (
  `Id_punicao` int(11) NOT NULL,
  `Fk_usuario` int(11) NOT NULL,
  `Fk_denuncia` int(11) NOT NULL,
  `Tipo` enum('alerta','suspensao','banimento','remocao_conteudo') NOT NULL,
  `Motivo` text NOT NULL,
  `Duracao` date DEFAULT NULL,
  `Data_Inicio` datetime NOT NULL,
  `Data_fim` datetime DEFAULT NULL,
  `Aplicado_por` int(11) NOT NULL,
  `Status` enum('ativa','expirada','retirada') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `registro_humor`
--

CREATE TABLE `registro_humor` (
  `Id_Registro_Humor` int(11) NOT NULL,
  `Fk_Humor` int(11) NOT NULL,
  `Observacao` text DEFAULT NULL,
  `Data` date NOT NULL,
  `Fk_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `registro_humor`
--

INSERT INTO `registro_humor` (`Id_Registro_Humor`, `Fk_Humor`, `Observacao`, `Data`, `Fk_usuario`) VALUES
(27, 11, '', '2025-10-12', 53),
(28, 17, '', '2025-10-11', 53),
(29, 11, '', '2024-10-12', 53),
(31, 9, '', '2025-10-26', 53);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `Id_usuario` int(10) NOT NULL,
  `Apelido` varchar(45) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Senha` varchar(200) NOT NULL,
  `Tipo` enum('administrador','usuario','','') NOT NULL,
  `Status` enum('ativo','inativo','suspenso','banido') NOT NULL,
  `Foto` varchar(100) NOT NULL,
  `Data_cadastro` datetime NOT NULL,
  `nametag` varchar(15) NOT NULL,
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`Id_usuario`, `Apelido`, `Email`, `Senha`, `Tipo`, `Status`, `Foto`, `Data_cadastro`, `nametag`, `bio`) VALUES
(52, 'administrador', 'adm@gmail.com', '$2b$10$WJOYVZLJrQZ2vnbN6.t3QO6rek87xCeuvm1CHyEXZSbi5t8xfAoka', 'administrador', 'ativo', '/avatars/sapato.png', '2025-10-10 11:09:12', 'administrador', 'Nada'),
(53, 'usuario_1', 'usuario1@gmail.com', '$2b$10$MSX8fmDsITEFidljIISUleiwED3Bw7sdp9Jzk/oT5o9GFWVph98jK', 'usuario', 'ativo', '/avatars/homem_lata.png', '2025-10-10 11:14:10', 'usuario_1', 'Exemplo de bio'),
(54, 'usuario_2', 'usuario2@gmail.com', '$2b$10$Bq8gSXQMKrtYQw0NulrlhOWY2ucTQLcmxLrXmjbmoRfRHIPiuNupS', 'usuario', 'ativo', '/avatars/sapato.png', '2025-10-10 11:46:38', 'usuario_2', ''),
(55, 'usuario_3', 'usuario3@gmail.com', '$2b$10$gki9CsHTOl/iNyPvlxJ84uUtVj4Hrp0tl.sbSDXkw0ikYczamWgXG', 'usuario', 'ativo', '/avatars/mágico.png', '2025-10-10 11:49:58', 'usuario_3', ''),
(56, 'usuario_4', 'usuario4@gmail.com', '$2b$10$NLuaPpia/hDbbjBu/Lfbbex0gEJw4g3KTrQVKgw1V4v5b2CG3d9w2', 'usuario', 'ativo', '/avatars/glinda.png', '2025-10-10 13:15:41', 'usuario_4', '');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `conteudo`
--
ALTER TABLE `conteudo`
  ADD PRIMARY KEY (`Id_conteudo`),
  ADD KEY `Fk_usuario` (`Fk_usuario`);

--
-- Índices de tabela `denuncia`
--
ALTER TABLE `denuncia`
  ADD PRIMARY KEY (`Id_denuncia`),
  ADD KEY `denuncia_ibfk_1` (`Fk_desabafo`),
  ADD KEY `denuncia_ibfk_2` (`Fk_resposta`),
  ADD KEY `denuncia_ibfk_3` (`Fk_usuario`),
  ADD KEY `fk_denunciado_por` (`Denunciado_por`);

--
-- Índices de tabela `desabafo`
--
ALTER TABLE `desabafo`
  ADD PRIMARY KEY (`Id_desabafo`),
  ADD KEY `desabafo_ibfk_1` (`Fk_usuario`);

--
-- Índices de tabela `humor`
--
ALTER TABLE `humor`
  ADD PRIMARY KEY (`id_humor`);

--
-- Índices de tabela `interacao`
--
ALTER TABLE `interacao`
  ADD PRIMARY KEY (`Id_interacao`),
  ADD KEY `interacao_ibfk_1` (`Fk_desabafo`),
  ADD KEY `interacao_ibfk_2` (`Fk_usuario`);

--
-- Índices de tabela `pronome`
--
ALTER TABLE `pronome`
  ADD PRIMARY KEY (`Id_pronome`),
  ADD KEY `Fk_usuario` (`Fk_usuario`);

--
-- Índices de tabela `punicao`
--
ALTER TABLE `punicao`
  ADD PRIMARY KEY (`Id_punicao`),
  ADD KEY `punicao_ibfk_2` (`Fk_denuncia`),
  ADD KEY `punicao_ibfk_3` (`Fk_usuario`),
  ADD KEY `punicao_ibfk_4` (`Aplicado_por`);

--
-- Índices de tabela `registro_humor`
--
ALTER TABLE `registro_humor`
  ADD PRIMARY KEY (`Id_Registro_Humor`),
  ADD KEY `registro_humor_ibfk_1` (`Fk_usuario`),
  ADD KEY `registro_humor_ibfk_2` (`Fk_Humor`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id_usuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `conteudo`
--
ALTER TABLE `conteudo`
  MODIFY `Id_conteudo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `denuncia`
--
ALTER TABLE `denuncia`
  MODIFY `Id_denuncia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de tabela `desabafo`
--
ALTER TABLE `desabafo`
  MODIFY `Id_desabafo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de tabela `humor`
--
ALTER TABLE `humor`
  MODIFY `id_humor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `interacao`
--
ALTER TABLE `interacao`
  MODIFY `Id_interacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT de tabela `pronome`
--
ALTER TABLE `pronome`
  MODIFY `Id_pronome` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de tabela `punicao`
--
ALTER TABLE `punicao`
  MODIFY `Id_punicao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de tabela `registro_humor`
--
ALTER TABLE `registro_humor`
  MODIFY `Id_Registro_Humor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id_usuario` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `conteudo`
--
ALTER TABLE `conteudo`
  ADD CONSTRAINT `conteudo_ibfk_1` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `denuncia`
--
ALTER TABLE `denuncia`
  ADD CONSTRAINT `denuncia_ibfk_1` FOREIGN KEY (`Fk_desabafo`) REFERENCES `desabafo` (`Id_desabafo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `denuncia_ibfk_2` FOREIGN KEY (`Fk_resposta`) REFERENCES `interacao` (`Id_interacao`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `denuncia_ibfk_3` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_denunciado_por` FOREIGN KEY (`Denunciado_por`) REFERENCES `usuario` (`Id_usuario`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Restrições para tabelas `desabafo`
--
ALTER TABLE `desabafo`
  ADD CONSTRAINT `desabafo_ibfk_1` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `interacao`
--
ALTER TABLE `interacao`
  ADD CONSTRAINT `interacao_ibfk_1` FOREIGN KEY (`Fk_desabafo`) REFERENCES `desabafo` (`Id_desabafo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interacao_ibfk_2` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `pronome`
--
ALTER TABLE `pronome`
  ADD CONSTRAINT `Fk_usuario` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `punicao`
--
ALTER TABLE `punicao`
  ADD CONSTRAINT `punicao_ibfk_2` FOREIGN KEY (`Fk_denuncia`) REFERENCES `denuncia` (`Id_denuncia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `punicao_ibfk_3` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `punicao_ibfk_4` FOREIGN KEY (`Aplicado_por`) REFERENCES `usuario` (`Id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Restrições para tabelas `registro_humor`
--
ALTER TABLE `registro_humor`
  ADD CONSTRAINT `registro_humor_ibfk_1` FOREIGN KEY (`Fk_usuario`) REFERENCES `usuario` (`Id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registro_humor_ibfk_2` FOREIGN KEY (`Fk_Humor`) REFERENCES `humor` (`id_humor`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
