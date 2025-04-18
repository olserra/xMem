# xmem MCP Server

Este é o servidor MCP (Model Context Protocol) do xmem, que expõe funcionalidades de gerenciamento de memórias e projetos através do protocolo MCP.

## Configuração

1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```env
DATABASE_URL=sua_url_do_banco
JWT_SECRET_KEY=sua_chave_secreta
```

3. Inicie o servidor:
```bash
python main.py
```

## Funções MCP Disponíveis

### Memórias
- `create_memory`: Cria uma nova memória
- `update_memory`: Atualiza uma memória existente
- `delete_memory`: Remove uma memória
- `assign_to_project`: Associa uma memória a um projeto
- `list_memories`: Lista memórias com filtros por tags e projeto

### Projetos
- `create_project`: Cria um novo projeto

## Autenticação

O servidor usa autenticação JWT. Inclua o token JWT no header `Authorization` como `Bearer <token>`.

## Integração com Agentes IA

Para integrar com agentes IA, use o SDK MCP Python:

```python
from model_context_protocol import MCPClient

client = MCPClient("http://localhost:8000/mcp")
response = await client.call_function("create_memory", {
    "content": "Nova memória",
    "tags": ["tag1", "tag2"]
})
```

## Próximos Passos

1. Implementar persistência de dados com Prisma
2. Adicionar mais funções para gerenciamento de projetos
3. Implementar compressão de histórico
4. Adicionar suporte a versionamento de schemas 