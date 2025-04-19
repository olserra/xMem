# xmem - Memory and Project Management

A comprehensive project management system with multiple services.

## Project Structure

```
xmem/
├── app/              # Next.js frontend application
├── services/         # Backend services
│   ├── mcp_server/  # Main Control Program server
│   └── whatsapp_agent/ # WhatsApp integration with knowledge base
├── lib/             # Shared libraries
└── public/          # Public assets
```

Welcome to xmem.xyz! This is a simple, open-source tool designed to help you manage context and _data for large language models (LLMs). It allows you to store and persist multiple _data entries, tagged with relevant labels, which can then be copied and used as context for new conversations. This is perfect for improving LLM interactions by reducing hallucinations and increasing performance.

## How it Works

The core functionality is simple yet powerful:
- **Create Data Entries**: Add your thoughts, experiences, or facts to the system. Each entry can be tagged with up to 3 relevant tags (e.g., Technology, Skills, Learning).
- **Persist the Data**: Each entry is saved so that you can retain context for future interactions.

## Key Features

- **Add Data**: Enter your thoughts and tag them with categories such as Technology, Learning, or Hobbies.
- **Data Persistence**: Store your data across sessions to carry context for ongoing conversations.
- **Filter Data**: Filter stored data by text or tags to quickly find the context you need.

## Use Cases and Practical Examples

### 1. **Learning Progress Tracker**
   - **Example**: As you study new topics, you can add entries like "I learned Python" or "I am improving my skills in data science".
   - **Tags**: Skills, Technology, Learning
   - **How It Helps**: When you interact with an LLM, you can provide your learning history, which improves the LLM's understanding of your knowledge base and enables better, context-aware answers.

### 2. **Personal Facts and Preferences**
   - **Example**: Save important personal facts like "I enjoy hiking" or "I prefer early morning meetings".
   - **Tags**: Personal Facts, Preferences, Hobbies
   - **How It Helps**: The LLM can recall personal preferences to provide more personalized responses in future interactions, such as recommending activities or adjusting the tone of the conversation.

### 3. **Work History and Goals**
   - **Example**: Track your professional milestones and future goals, like "Completed my first project at Company X" or "Goal: Learn cloud computing".
   - **Tags**: Work History, Goals, Career
   - **How It Helps**: When interacting with an LLM, your work history and professional goals can be referenced to provide tailored career advice or project management tips.

### 4. **Mindset and Self-Improvement**
   - **Example**: Record entries like "I am focusing on improving my mindset" or "Struggling with work-life balance".
   - **Tags**: Mindset, Self-Improvement, Productivity
   - **How It Helps**: With the LLM having context on your mindset and self-improvement goals, it can offer advice that aligns with your current priorities and challenges.

### 5. **Health and Well-being**
   - **Example**: Track your health-related milestones such as "I started exercising daily" or "Struggling to sleep well".
   - **Tags**: Health, Well-being, Productivity
   - **How It Helps**: When the LLM has access to your health and well-being context, it can provide more relevant advice on managing stress, improving sleep, or maintaining healthy habits.

## How to Get Started

1. **Create New Memory**: Enter your thoughts or notes into the input box and tag them with appropriate labels.
2. **Save Your Data**: Once you've added your data, they will be automatically saved for future use.
3. **Use in LLM Conversations**: Paste the copied JSON data as context in your preferred LLM (e.g., ChatGPT, Gemini, Claude, etc.), allowing the model to use the data to improve the conversation.

## Roadmap

### **Q1 2025**
- Implement advanced filtering options for data.
- Enable import/export of _data data to and from other platforms.

### **Q2 2025**
- Expand _data tagging system with custom tag creation.
- Enhance user interface for easier navigation and _data management.

### **Q3 2025**
- Introduce _data sharing options for collaborative work.
- Begin integrations with popular LLM APIs for automatic context injection.

## Contributing

We welcome contributions from the community! Whether you're improving the UI, suggesting features, or fixing bugs, your help is appreciated.

To contribute:
- Fork the repository
- Create a feature branch
- Submit a pull request

For more detailed contributing instructions, check out [CONTRIBUTING.md](./CONTRIBUTING.md).

---

Thank you for being part of xmem.xyz. Let's make LLMs smarter together!

## Services

### MCP Server
The main control program server that handles core functionality. See [services/mcp_server/README.md](services/mcp_server/README.md) for details.

### WhatsApp Agent
A service that provides WhatsApp integration with knowledge base capabilities. See [services/whatsapp_agent/README.md](services/whatsapp_agent/README.md) for details.
