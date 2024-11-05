// skills.ts
export const skills = [
    {
        id: 1,
        title: "Machine Learning",
        description: "Learn algorithms and techniques to enable computers to learn from data.",
        category: "ai",
        labels: ["Intermediate", "Data Science"],
        questions: [
            { 
                id: 1, 
                question: "What is supervised learning?", 
                answer: "A type of machine learning where the model is trained on labeled data.",
                options: [
                    "Learning without supervision",
                    "Learning from labeled data",
                    "Learning through trial and error",
                    "Learning in real-time",
                    "Learning from unstructured data"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "Explain overfitting in machine learning.", 
                answer: "Overfitting occurs when a model learns the noise in the training data instead of the actual pattern.",
                options: [
                    "Generalizing well to new data",
                    "Learning too little from training data",
                    "Learning the noise in the training data",
                    "Balancing bias and variance",
                    "Using too many training samples"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 3, 
                question: "What are decision trees?", 
                answer: "Decision trees are a flowchart-like structure that makes decisions based on asking questions.",
                options: [
                    "A type of neural network",
                    "A graphical representation of data",
                    "A flowchart-like structure for decision making",
                    "A statistical model",
                    "A clustering technique"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "What is cross-validation?", 
                answer: "A technique for assessing how the results of a statistical analysis will generalize to an independent data set.",
                options: [
                    "A method for hyperparameter tuning",
                    "A technique for splitting data",
                    "A method to avoid overfitting",
                    "A way to assess model performance",
                    "A way to visualize data"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 5, 
                question: "What is the purpose of feature scaling?", 
                answer: "Feature scaling ensures that different features contribute equally to the model.",
                options: [
                    "To reduce noise in data",
                    "To enhance model interpretability",
                    "To ensure all features are on a similar scale",
                    "To improve training speed",
                    "To avoid overfitting"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What are ensemble methods?", 
                answer: "Techniques that create multiple models and combine them to produce improved results.",
                options: [
                    "Single models that generalize well",
                    "Models that work independently",
                    "Techniques that combine multiple models",
                    "Statistical methods for estimation",
                    "Supervised learning techniques"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 7, 
                question: "What is a support vector machine?", 
                answer: "A supervised learning model that can classify data into different categories.",
                options: [
                    "An unsupervised learning technique",
                    "A type of decision tree",
                    "A kernel-based learning algorithm",
                    "A clustering algorithm",
                    "A type of neural network"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "Explain the concept of bias-variance tradeoff.", 
                answer: "It is the balance between a model's complexity and its performance.",
                options: [
                    "The relationship between training and testing data",
                    "The tradeoff between underfitting and overfitting",
                    "The balance between different model parameters",
                    "The importance of feature selection",
                    "The effect of model interpretability"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 9, 
                question: "What are neural networks?", 
                answer: "Computational models inspired by the human brain, consisting of interconnected nodes.",
                options: [
                    "A type of unsupervised learning",
                    "Biological models of human cognition",
                    "Mathematical models for classification",
                    "Interconnected nodes for processing information",
                    "Statistical methods for prediction"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 10, 
                question: "How do you evaluate the performance of a regression model?", 
                answer: "Using metrics like R-squared, Mean Absolute Error, and Root Mean Squared Error.",
                options: [
                    "Using accuracy and precision",
                    "Using R-squared and Mean Absolute Error",
                    "Using F1 score and ROC curve",
                    "Using cross-validation techniques",
                    "Using classification reports"
                ],
                correctOptionIndex: 1 
            },
        ]
    },
    {
        id: 2,
        title: "Natural Language Processing (NLP)",
        description: "Understand how to process and analyze human language using AI.",
        labels: ["Intermediate", "Linguistics"],
        questions: [
            { 
                id: 1, 
                question: "What is tokenization?", 
                answer: "The process of breaking down text into individual words or phrases.",
                options: [
                    "Creating word embeddings",
                    "Splitting text into meaningful components",
                    "Identifying key phrases",
                    "Removing stop words",
                    "Analyzing sentiment"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "Define stemming and lemmatization.", 
                answer: "Stemming reduces words to their root form; lemmatization converts words to their base form.",
                options: [
                    "Both techniques reduce words to their base form",
                    "Stemming is more accurate than lemmatization",
                    "Lemmatization is faster than stemming",
                    "They are both used for data cleaning",
                    "They are the same process"
                ],
                correctOptionIndex: 0 
            },
            { 
                id: 3, 
                question: "What is sentiment analysis?", 
                answer: "A technique used to determine the emotional tone behind a series of words.",
                options: [
                    "The process of summarizing text",
                    "Identifying the main topics in text",
                    "Determining the emotion expressed in text",
                    "The process of classifying text",
                    "Translating text into another language"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "Explain the concept of word embeddings.", 
                answer: "Word embeddings are vector representations of words that capture their meaning.",
                options: [
                    "The process of converting words into numbers",
                    "A way to visualize text data",
                    "Representations of words in a continuous vector space",
                    "The process of creating stop words",
                    "A type of data cleaning method"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "What is named entity recognition?", 
                answer: "A process of identifying and classifying key information in text.",
                options: [
                    "Identifying the author of a text",
                    "Recognizing important entities in text",
                    "Classifying text into categories",
                    "Analyzing sentiment in text",
                    "Tokenizing text into individual words"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 6, 
                question: "What is the purpose of stop words?", 
                answer: "Stop words are common words that are often filtered out in NLP tasks.",
                options: [
                    "To enhance the meaning of text",
                    "To reduce noise in the data",
                    "To improve the accuracy of models",
                    "To help with tokenization",
                    "To summarize the text"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 7, 
                question: "What is the purpose of a language model?", 
                answer: "To predict the probability of a sequence of words.",
                options: [
                    "To classify text",
                    "To generate new text",
                    "To predict next words in a sentence",
                    "To extract key phrases",
                    "To visualize text data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "Explain how transformers work in NLP.", 
                answer: "Transformers use self-attention mechanisms to weigh the importance of different words in a sentence.",
                options: [
                    "By using recurrent layers",
                    "By processing words sequentially",
                    "Using attention mechanisms to focus on relevant words",
                    "By embedding words into vectors",
                    "By using convolutional layers"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 9, 
                question: "What is BERT?", 
                answer: "A pre-trained transformer model for NLP tasks that stands for Bidirectional Encoder Representations from Transformers.",
                options: [
                    "A language generation model",
                    "A framework for NLP",
                    "A transformer model for bidirectional training",
                    "A type of neural network",
                    "An embedding technique"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 10, 
                question: "How is text classification performed?", 
                answer: "By using machine learning models trained to categorize text into predefined classes.",
                options: [
                    "By summarizing text",
                    "By using neural networks",
                    "By analyzing sentiment",
                    "By categorizing text into classes",
                    "By tokenizing words"
                ],
                correctOptionIndex: 3 
            },
        ]
    },
    {
        id: 3,
        title: "Computer Vision",
        description: "Develop algorithms to enable computers to interpret and understand visual information.",
        labels: ["Advanced", "Image Processing"],
        questions: [
            { 
                id: 1, 
                question: "What is image segmentation?", 
                answer: "The process of partitioning an image into multiple segments to simplify analysis.",
                options: [
                    "Detecting edges in an image",
                    "Dividing an image into regions",
                    "Identifying objects in an image",
                    "Reducing the size of an image",
                    "Classifying images into categories"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "Explain the difference between image classification and object detection.", 
                answer: "Classification identifies what an image contains; detection locates objects within the image.",
                options: [
                    "Classification identifies objects; detection categorizes them",
                    "Both are the same process",
                    "Classification labels images; detection finds objects",
                    "Detection is less accurate than classification",
                    "Neither involves machine learning"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 3, 
                question: "What are convolutional neural networks (CNNs)?", 
                answer: "Deep learning algorithms specifically designed for processing structured grid data like images.",
                options: [
                    "A type of feedforward neural network",
                    "A type of recurrent neural network",
                    "Deep learning algorithms for image processing",
                    "Supervised learning models",
                    "Statistical models for regression"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "What is feature extraction in computer vision?", 
                answer: "The process of identifying and isolating relevant features from an image.",
                options: [
                    "Identifying key points in an image",
                    "Reducing the size of an image",
                    "Applying filters to an image",
                    "Enhancing image resolution",
                    "The process of categorizing images"
                ],
                correctOptionIndex: 0 
            },
            { 
                id: 5, 
                question: "Define optical character recognition (OCR).", 
                answer: "The conversion of images of text into machine-encoded text.",
                options: [
                    "Detecting edges in images",
                    "Extracting features from images",
                    "Converting text from images into editable text",
                    "Classifying text into categories",
                    "Translating text into other languages"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What are generative adversarial networks (GANs)?", 
                answer: "A class of machine learning frameworks designed by opposing networks to generate new data.",
                options: [
                    "Two neural networks competing against each other",
                    "A type of classification algorithm",
                    "Neural networks for image classification",
                    "Algorithms that analyze data",
                    "Statistical models for regression"
                ],
                correctOptionIndex: 0 
            },
            { 
                id: 7, 
                question: "How does transfer learning apply to computer vision?", 
                answer: "Using pre-trained models on new tasks to save time and resources.",
                options: [
                    "Training a model from scratch",
                    "Fine-tuning an existing model for a new task",
                    "Using a model for classification only",
                    "Creating new training data",
                    "Ignoring previous training results"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 8, 
                question: "What is the purpose of image augmentation?", 
                answer: "To artificially expand the dataset by creating modified versions of images.",
                options: [
                    "To reduce noise in images",
                    "To create new training samples",
                    "To classify images more accurately",
                    "To enhance image resolution",
                    "To summarize image content"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 9, 
                question: "Describe how facial recognition works.", 
                answer: "By detecting and identifying human faces within images.",
                options: [
                    "Using edge detection algorithms",
                    "By measuring distances between facial features",
                    "By using convolutional neural networks",
                    "By categorizing images of faces",
                    "By identifying objects in images"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 10, 
                question: "What is the role of OpenCV?", 
                answer: "An open-source computer vision and machine learning software library.",
                options: [
                    "To develop machine learning algorithms",
                    "To enhance image quality",
                    "To provide tools for image processing and computer vision",
                    "To create neural networks",
                    "To classify images"
                ],
                correctOptionIndex: 2 
            },
        ]
    },
    {
        id: 4,
        title: "Reinforcement Learning",
        description: "Explore techniques where agents learn to make decisions through trial and error.",
        labels: ["Advanced", "Decision Making"],
        questions: [
            { 
                id: 1, 
                question: "What is reinforcement learning?", 
                answer: "A type of machine learning where an agent learns to make decisions by taking actions in an environment.",
                options: [
                    "A method for supervised learning",
                    "A type of unsupervised learning",
                    "Learning through interactions with an environment",
                    "Using labeled data to train",
                    "Learning from historical data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 2, 
                question: "Define the term 'agent' in reinforcement learning.", 
                answer: "An entity that makes decisions and learns from its interactions with the environment.",
                options: [
                    "A type of neural network",
                    "A component of the learning environment",
                    "The learner in the reinforcement learning framework",
                    "The data used for training",
                    "The evaluator of the model"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 3, 
                question: "What is a reward signal?", 
                answer: "Feedback given to the agent based on its actions to encourage or discourage behavior.",
                options: [
                    "A way to evaluate model accuracy",
                    "Feedback for decision making",
                    "A type of loss function",
                    "The score of the model",
                    "An input feature"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 4, 
                question: "Explain the concept of a Markov decision process.", 
                answer: "A mathematical framework for modeling decision-making where outcomes are partly random.",
                options: [
                    "A type of statistical model",
                    "A framework for decision-making with uncertainty",
                    "An algorithm for reinforcement learning",
                    "A classification method",
                    "A type of neural network"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 5, 
                question: "What is Q-learning?", 
                answer: "A reinforcement learning algorithm that seeks to learn the value of an action in a particular state.",
                options: [
                    "A type of unsupervised learning",
                    "An algorithm for supervised learning",
                    "A model-free reinforcement learning algorithm",
                    "A method for hyperparameter tuning",
                    "A clustering algorithm"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What role does exploration play in reinforcement learning?", 
                answer: "Exploration involves trying new actions to discover their effects.",
                options: [
                    "Avoiding actions that have been tried",
                    "Balancing between exploration and exploitation",
                    "Only focusing on the best-known actions",
                    "Following a fixed policy",
                    "Learning from historical data only"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 7, 
                question: "Define 'policy' in the context of reinforcement learning.", 
                answer: "A strategy that the agent employs to determine its actions based on the current state.",
                options: [
                    "The goal of the agent",
                    "The rewards given to the agent",
                    "The set of actions available to the agent",
                    "The strategy the agent uses for decision making",
                    "The environment's response to the agent"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 8, 
                question: "What are deep Q-networks?", 
                answer: "A combination of Q-learning and deep neural networks to handle large state spaces.",
                options: [
                    "Using shallow networks for Q-learning",
                    "A method for unsupervised learning",
                    "A type of reinforcement learning algorithm",
                    "A neural network that outputs Q-values",
                    "A clustering method"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 9, 
                question: "What is the difference between on-policy and off-policy learning?", 
                answer: "On-policy uses the policy being improved, while off-policy uses a different policy to generate behavior.",
                options: [
                    "On-policy uses historical data; off-policy does not",
                    "Off-policy uses exploration; on-policy does not",
                    "Both methods are identical",
                    "On-policy improves the policy; off-policy uses a separate policy",
                    "On-policy is faster than off-policy"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 10, 
                question: "What is the significance of the discount factor in reinforcement learning?", 
                answer: "It determines the importance of future rewards compared to immediate rewards.",
                options: [
                    "It controls the learning rate",
                    "It measures the agent's performance",
                    "It balances exploration and exploitation",
                    "It prioritizes immediate rewards",
                    "It affects the agent's decision-making process"
                ],
                correctOptionIndex: 0 
            },
        ]
    },
    {
        id: 5,
        title: "AI Ethics",
        description: "Understand the ethical implications and responsibilities of AI development.",
        labels: ["Beginner", "Ethics"],
        questions: [
            { 
                id: 1, 
                question: "What is AI ethics?", 
                answer: "The field of study that examines the moral implications of artificial intelligence.",
                options: [
                    "The study of AI technologies",
                    "Ethical considerations in AI development",
                    "Legal regulations surrounding AI",
                    "The programming of AI systems",
                    "The impact of AI on society"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "What are some potential biases in AI?", 
                answer: "Biases can arise from skewed training data, leading to unfair outcomes.",
                options: [
                    "Biases are not possible in AI",
                    "Biases arise from user inputs",
                    "Biases can come from training data",
                    "Biases can enhance model performance",
                    "Biases are easily eliminated"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 3, 
                question: "What is the importance of transparency in AI systems?", 
                answer: "Transparency helps users understand how decisions are made and fosters trust.",
                options: [
                    "Transparency is not needed",
                    "It improves system performance",
                    "It helps users trust AI decisions",
                    "It increases system complexity",
                    "It reduces data requirements"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "How can AI impact employment?", 
                answer: "AI can lead to job displacement as well as the creation of new job categories.",
                options: [
                    "AI will eliminate all jobs",
                    "AI has no impact on employment",
                    "AI creates new job opportunities",
                    "AI only creates high-skill jobs",
                    "AI will only impact low-skill jobs"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "What is algorithmic accountability?", 
                answer: "The principle that AI systems should be held responsible for their outcomes.",
                options: [
                    "AI should not be held accountable",
                    "Developers are responsible for algorithms",
                    "AI systems are responsible for decisions",
                    "Users should be accountable for AI outcomes",
                    "Accountability is not needed"
                ],
                correctOptionIndex: 0 
            },
            { 
                id: 6, 
                question: "Why is data privacy important in AI?", 
                answer: "To protect individuals' personal information and comply with regulations.",
                options: [
                    "Data privacy is not necessary",
                    "It ensures user data is shared",
                    "It helps improve AI accuracy",
                    "To comply with regulations",
                    "It reduces model performance"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 7, 
                question: "What are the ethical considerations of using AI in healthcare?", 
                answer: "Issues include data privacy, consent, and potential biases in diagnosis.",
                options: [
                    "AI has no ethical considerations in healthcare",
                    "It improves patient care",
                    "Biases can lead to unequal treatment",
                    "Data privacy is not an issue",
                    "AI should replace human doctors"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "What is the role of public policy in AI ethics?", 
                answer: "Public policy can guide the development and use of AI technologies responsibly.",
                options: [
                    "Public policy is irrelevant to AI",
                    "It helps regulate AI usage",
                    "It encourages unregulated AI",
                    "It is only for data protection",
                    "It is not necessary"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 9, 
                question: "How can we mitigate bias in AI systems?", 
                answer: "By using diverse training datasets and regularly auditing algorithms.",
                options: [
                    "Bias cannot be mitigated",
                    "Using uniform training data",
                    "Regular audits and diverse data",
                    "Avoiding AI altogether",
                    "By ignoring algorithm outputs"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 10, 
                question: "What is the significance of informed consent in AI?", 
                answer: "Informed consent ensures that individuals understand how their data will be used.",
                options: [
                    "Consent is not needed",
                    "It protects user privacy",
                    "It is only for medical data",
                    "It helps improve AI performance",
                    "It is not important"
                ],
                correctOptionIndex: 1 
            },
        ]
    },
    {
        id: 6,
        title: "Deep Learning",
        description: "Utilize neural networks to tackle complex problems and improve model performance.",
        labels: ["Advanced", "Neural Networks"],
        questions: [
            { 
                id: 1, 
                question: "What is deep learning?", 
                answer: "A subset of machine learning involving neural networks with many layers.",
                options: [
                    "A type of supervised learning",
                    "A method for clustering data",
                    "A form of unsupervised learning",
                    "A type of neural network architecture",
                    "A shallow learning technique"
                ],
                correctOptionIndex: 0 
            },
            { 
                id: 2, 
                question: "Explain the architecture of a neural network.", 
                answer: "A neural network consists of layers of interconnected nodes (neurons).",
                options: [
                    "A series of linear transformations",
                    "A structure made up of layers and neurons",
                    "An algorithm for data processing",
                    "A flowchart for decision making",
                    "A model for data visualization"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 3, 
                question: "What is backpropagation?", 
                answer: "A method used to optimize neural networks by minimizing error through gradient descent.",
                options: [
                    "A technique for data augmentation",
                    "A way to measure model performance",
                    "An algorithm for updating weights in neural networks",
                    "A method for training unsupervised models",
                    "A method for visualizing neural networks"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "Define activation functions.", 
                answer: "Functions that determine the output of a neuron based on its input.",
                options: [
                    "Functions for data preprocessing",
                    "Mathematical equations for calculating losses",
                    "Functions that regulate neuron outputs",
                    "Functions that optimize weights",
                    "Functions for initializing neural networks"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "What are convolutional neural networks used for?", 
                answer: "Primarily for image processing tasks.",
                options: [
                    "Text analysis",
                    "Time series prediction",
                    "Image recognition and processing",
                    "Natural language processing",
                    "Reinforcement learning"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What is a recurrent neural network (RNN)?", 
                answer: "A type of neural network designed for sequential data processing.",
                options: [
                    "A network for image processing",
                    "A network for structured data",
                    "A type of feedforward neural network",
                    "A network that processes sequences",
                    "A clustering technique"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 7, 
                question: "Explain dropout in deep learning.", 
                answer: "A regularization technique that randomly drops units from the neural network during training.",
                options: [
                    "A method for increasing model complexity",
                    "A technique to prevent overfitting",
                    "A way to initialize weights",
                    "A method for feature extraction",
                    "A technique to improve accuracy"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 8, 
                question: "What is transfer learning?", 
                answer: "A technique where a pre-trained model is fine-tuned for a specific task.",
                options: [
                    "Training a model from scratch",
                    "Using a pre-trained model for a new task",
                    "A method for unsupervised learning",
                    "Creating new training data",
                    "Using multiple models for prediction"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 9, 
                question: "Describe the vanishing gradient problem.", 
                answer: "A challenge faced during training deep networks where gradients become too small.",
                options: [
                    "A problem with data normalization",
                    "A problem that only occurs in shallow networks",
                    "A challenge in optimizing weights",
                    "A phenomenon in deep learning during backpropagation",
                    "An advantage of using deep learning"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 10, 
                question: "What are Generative Adversarial Networks (GANs)?", 
                answer: "A framework where two neural networks compete against each other to generate new data.",
                options: [
                    "A type of regression model",
                    "A technique for unsupervised learning",
                    "Two networks that create data",
                    "A model for image classification",
                    "A framework for decision trees"
                ],
                correctOptionIndex: 2 
            },
        ]
    },
    {
        id: 7,
        title: "Data Preprocessing",
        description: "Learn techniques to prepare and clean data for effective AI modeling.",
        labels: ["Beginner", "Data Management"],
        questions: [
            { 
                id: 1, 
                question: "What is data preprocessing?", 
                answer: "The steps taken to clean and prepare raw data for analysis.",
                options: [
                    "The process of analyzing data",
                    "Cleaning and transforming raw data",
                    "The visualization of data",
                    "Collecting data from various sources",
                    "The final analysis of data"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "What is normalization?", 
                answer: "A technique to scale numerical data to a common range.",
                options: [
                    "The process of removing duplicates",
                    "Scaling features to a common scale",
                    "The conversion of categorical data to numerical",
                    "The process of handling missing values",
                    "A technique to visualize data"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 3, 
                question: "What is feature selection?", 
                answer: "The process of identifying the most important features for model training.",
                options: [
                    "Reducing the size of the dataset",
                    "Selecting the best algorithm",
                    "Choosing the most relevant features",
                    "Transforming features into different formats",
                    "Normalizing data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "What is the purpose of handling missing data?", 
                answer: "To ensure data quality and improve model performance.",
                options: [
                    "To reduce data volume",
                    "To maintain dataset size",
                    "To improve the accuracy of models",
                    "To make data more complex",
                    "To enhance data visualization"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "Explain one-hot encoding.", 
                answer: "A method for converting categorical variables into a binary matrix.",
                options: [
                    "Converting numerical data to categorical",
                    "A technique to standardize data",
                    "Encoding categorical data as binary vectors",
                    "Reducing dimensions of data",
                    "A method for data augmentation"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What are outliers?", 
                answer: "Data points that differ significantly from other observations.",
                options: [
                    "The average of a dataset",
                    "Values within the normal range",
                    "Data points that have no impact",
                    "Points that lie outside the expected range",
                    "The maximum value in the dataset"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 7, 
                question: "How can data be transformed?", 
                answer: "By applying mathematical functions to change the scale or distribution of data.",
                options: [
                    "By visualizing the data",
                    "By removing irrelevant data",
                    "By applying techniques like scaling or encoding",
                    "By collecting more data",
                    "By ignoring certain data points"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "What is data splitting?", 
                answer: "The process of dividing data into training and testing sets.",
                options: [
                    "Combining all data for training",
                    "Segmenting data for visualization",
                    "Dividing data for model evaluation",
                    "Collecting data from different sources",
                    "Removing duplicates from data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 9, 
                question: "Why is data visualization important?", 
                answer: "To help understand the data and identify patterns and trends.",
                options: [
                    "To analyze text data",
                    "To improve data accuracy",
                    "To make data more complex",
                    "To summarize the data",
                    "To assist in data interpretation"
                ],
                correctOptionIndex: 4 
            },
            { 
                id: 10, 
                question: "What is feature engineering?", 
                answer: "The process of using domain knowledge to create features that make machine learning algorithms work.",
                options: [
                    "Selecting existing features only",
                    "Creating new features from existing ones",
                    "Removing unnecessary features",
                    "Normalizing features",
                    "Reducing features to one dimension"
                ],
                correctOptionIndex: 1 
            },
        ]
    },
    {
        id: 8,
        title: "Prompt Engineering",
        description: "Develop skills in crafting effective prompts for AI language models.",
        labels: ["Intermediate", "AI Interaction"],
        questions: [
            { 
                id: 1, 
                question: "What is prompt engineering?", 
                answer: "The art of designing and structuring prompts to elicit desired responses from AI models.",
                options: [
                    "Creating random prompts",
                    "Fine-tuning AI models",
                    "Designing questions for surveys",
                    "Crafting inputs for language models",
                    "Analyzing AI responses"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 2, 
                question: "Why is specificity important in prompts?", 
                answer: "Specific prompts help guide the model to provide more accurate and relevant responses.",
                options: [
                    "Specificity does not matter",
                    "To reduce the length of responses",
                    "To make prompts easier to read",
                    "To improve the model's accuracy",
                    "To avoid ambiguous questions"
                ],
                correctOptionIndex: 4 
            },
            { 
                id: 3, 
                question: "What is an example of a good prompt?", 
                answer: "A clear and concise question that provides context.",
                options: [
                    "What is the meaning of life?",
                    "Explain everything about physics.",
                    "Can you provide a summary of the book?",
                    "Tell me something interesting.",
                    "Give me a detailed response."
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "How can you adjust prompts for better outcomes?", 
                answer: "By iterating and refining prompts based on model outputs.",
                options: [
                    "Using the same prompt every time",
                    "Ignoring model feedback",
                    "Changing wording and structure",
                    "Asking more questions",
                    "Lengthening prompts"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "What role does context play in prompts?", 
                answer: "Context helps the model understand the desired outcome and respond appropriately.",
                options: [
                    "Context is irrelevant",
                    "It confuses the model",
                    "It helps guide the model's understanding",
                    "It makes prompts longer",
                    "It has no effect on responses"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 6, 
                question: "What is an iterative approach in prompt engineering?", 
                answer: "Testing and refining prompts based on the responses received.",
                options: [
                    "Using the same prompt repeatedly",
                    "Creating prompts without testing",
                    "Adjusting prompts after observing outputs",
                    "Designing prompts randomly",
                    "Ignoring the model's output"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 7, 
                question: "What is the impact of ambiguity in prompts?", 
                answer: "Ambiguous prompts can lead to unclear or irrelevant responses.",
                options: [
                    "It improves response quality",
                    "It has no impact",
                    "It makes responses more concise",
                    "It can confuse the model",
                    "It guarantees accurate answers"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 8, 
                question: "Why is it useful to provide examples in prompts?", 
                answer: "Examples help clarify expectations and guide the model's responses.",
                options: [
                    "Examples complicate prompts",
                    "They provide additional context",
                    "Examples are unnecessary",
                    "They confuse the model",
                    "They have no impact"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 9, 
                question: "What is the purpose of feedback in prompt engineering?", 
                answer: "To learn from the model's responses and improve future prompts.",
                options: [
                    "Feedback is not useful",
                    "To evaluate model performance only",
                    "To refine prompt strategies",
                    "To create new models",
                    "To generate random prompts"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 10, 
                question: "How can different phrasings affect responses?", 
                answer: "Different phrasings can significantly change the model's interpretation and output.",
                options: [
                    "They have no effect on responses",
                    "Only length matters",
                    "Changing wording can lead to different outcomes",
                    "Responses are fixed",
                    "All phrasings yield the same results"
                ],
                correctOptionIndex: 2 
            },
        ]
    },
    {
        id: 9,
        title: "AI Model Evaluation",
        description: "Understand methods to evaluate and improve AI model performance.",
        labels: ["Intermediate", "Modeling"],
        questions: [
            { 
                id: 1, 
                question: "What is model evaluation?", 
                answer: "The process of assessing how well a model performs against a set of metrics.",
                options: [
                    "Testing the model with new data",
                    "Adjusting model parameters",
                    "Measuring model accuracy and performance",
                    "Training the model",
                    "Collecting more data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 2, 
                question: "What is cross-validation?", 
                answer: "A technique for evaluating the performance of a model by training it on multiple subsets of data.",
                options: [
                    "Using a single training set",
                    "Evaluating on unseen data only",
                    "Testing the model with no training",
                    "A method for hyperparameter tuning",
                    "A technique to avoid overfitting"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 3, 
                question: "What is precision in model evaluation?", 
                answer: "The ratio of true positive predictions to the total predicted positives.",
                options: [
                    "The total number of true predictions",
                    "The ratio of relevant instances to the total instances",
                    "The accuracy of the model",
                    "The proportion of true positives among all positive results",
                    "The measure of the model's robustness"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 4, 
                question: "What is recall in model evaluation?", 
                answer: "The ratio of true positive predictions to the actual positives in the data.",
                options: [
                    "The ratio of true positives to false negatives",
                    "The proportion of relevant instances retrieved",
                    "The accuracy of the model's predictions",
                    "The total number of predictions made",
                    "The proportion of true negatives"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 5, 
                question: "What is F1 score?", 
                answer: "The harmonic mean of precision and recall, providing a balance between the two metrics.",
                options: [
                    "A measure of accuracy",
                    "The ratio of true positives to all predictions",
                    "A single metric for model performance",
                    "The average of precision and recall",
                    "The geometric mean of precision and recall"
                ],
                correctOptionIndex: 4 
            },
            { 
                id: 6, 
                question: "What is a confusion matrix?", 
                answer: "A table used to describe the performance of a classification model by showing true vs. predicted classifications.",
                options: [
                    "A method for visualizing data",
                    "A way to assess data quality",
                    "A tool for understanding model performance",
                    "A technique for cross-validation",
                    "A method for feature selection"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 7, 
                question: "Why is it important to use multiple metrics for evaluation?", 
                answer: "Different metrics provide varied insights into model performance and effectiveness.",
                options: [
                    "Using a single metric is sufficient",
                    "Multiple metrics create confusion",
                    "Different metrics highlight different aspects of performance",
                    "Only accuracy is needed",
                    "Metrics do not impact model evaluation"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "What is overfitting?", 
                answer: "When a model learns noise and details from training data to the extent it performs poorly on new data.",
                options: [
                    "The model generalizes well",
                    "The model learns patterns accurately",
                    "The model performs well on unseen data",
                    "The model is too complex for the data",
                    "The model has low training accuracy"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 9, 
                question: "What is underfitting?", 
                answer: "When a model is too simple to capture the underlying pattern of the data.",
                options: [
                    "The model learns the noise in the data",
                    "The model has high bias and low variance",
                    "The model generalizes too well",
                    "The model performs poorly on training data",
                    "The model has high complexity"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 10, 
                question: "What is AUC-ROC curve?", 
                answer: "A performance measurement for classification problems at various threshold settings.",
                options: [
                    "A method for regression analysis",
                    "A technique to visualize the performance of a binary classifier",
                    "A statistical test for model comparison",
                    "A way to visualize data distributions",
                    "A method for feature selection"
                ],
                correctOptionIndex: 1 
            },
        ]
    },
    {
        id: 10,
        title: "Generative AI",
        description: "Learn about models that can generate new content, such as text and images.",
        labels: ["Advanced", "Creativity"],
        questions: [
            { 
                id: 1, 
                question: "What is generative AI?", 
                answer: "AI that is capable of generating new content based on input data.",
                options: [
                    "AI that analyzes existing content",
                    "AI that can produce new, original content",
                    "AI that operates without data",
                    "AI that only classifies data",
                    "AI focused on data retrieval"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 2, 
                question: "How do generative models work?", 
                answer: "They learn from a training set to generate new samples that resemble the training data.",
                options: [
                    "By analyzing historical data",
                    "By creating random outputs",
                    "By learning patterns from existing data",
                    "By following predetermined rules",
                    "By using fixed parameters"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 3, 
                question: "What is a GAN?", 
                answer: "A Generative Adversarial Network consists of two neural networks competing against each other.",
                options: [
                    "A single neural network model",
                    "Two models working together",
                    "A pair of competing networks",
                    "A model for data analysis",
                    "An ensemble of classifiers"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 4, 
                question: "What is the purpose of the generator in a GAN?", 
                answer: "To create new data instances that resemble the training data.",
                options: [
                    "To evaluate the quality of generated data",
                    "To provide input for the discriminator",
                    "To produce outputs that are indistinguishable from real data",
                    "To classify generated data",
                    "To summarize data"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 5, 
                question: "What does the discriminator do in a GAN?", 
                answer: "It evaluates the authenticity of the generated data compared to real data.",
                options: [
                    "To generate new samples",
                    "To classify data into categories",
                    "To detect anomalies in data",
                    "To differentiate between real and generated data",
                    "To summarize data"
                ],
                correctOptionIndex: 3 
            },
            { 
                id: 6, 
                question: "What is a language model?", 
                answer: "A model that predicts the next word in a sequence based on previous words.",
                options: [
                    "A model that analyzes images",
                    "A model that generates text based on context",
                    "A model for data classification",
                    "A model for data visualization",
                    "A model that summarizes data"
                ],
                correctOptionIndex: 1 
            },
            { 
                id: 7, 
                question: "What is text generation?", 
                answer: "The process of creating new text based on learned patterns from existing text.",
                options: [
                    "Summarizing existing text",
                    "Translating text into other languages",
                    "Creating new content using learned patterns",
                    "Editing existing text",
                    "Classifying text into categories"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 8, 
                question: "What is the role of training data in generative AI?", 
                answer: "Training data is crucial as it teaches the model the characteristics of the content it needs to generate.",
                options: [
                    "It is not important",
                    "It only serves for testing",
                    "It shapes the model's understanding of content",
                    "It is used for data analysis",
                    "It improves model performance"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 9, 
                question: "How can generative AI be used in art?", 
                answer: "By creating new artwork based on styles and patterns learned from existing art.",
                options: [
                    "Only by copying existing art",
                    "To analyze art trends",
                    "To generate new, original pieces of art",
                    "To classify artworks into genres",
                    "To evaluate the quality of art"
                ],
                correctOptionIndex: 2 
            },
            { 
                id: 10, 
                question: "What are some ethical concerns related to generative AI?", 
                answer: "Concerns include copyright issues and the potential for misuse in creating deepfakes.",
                options: [
                    "Generative AI has no ethical concerns",
                    "It only affects artists",
                    "It raises issues around authenticity and ownership",
                    "It can only create beneficial outcomes",
                    "It reduces the need for human creativity"
                ],
                correctOptionIndex: 2 
            },
        ]
    }
];
