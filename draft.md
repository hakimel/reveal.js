# Padrões de Agentes com Quarkus Flow

Vamos entender alguns termos, vamos começar por aplicações AI-Infused. O isso significa?

É fazer com que a IA faça parte do seu dia a dia fazendo parte da solução que resolve problemas do seu negócio.

O jeito mais comum de utilizar IA no nosso dia a dia como desenvolvedor é se comunicando com LLMs, e hoje a gente tem alguns frameworks no mundo Java que fazem isso pra gente:

- Langchain4J
- Spring AI
- Embabel

Nós, vamos focar no Langchain4J com Quarkus. Nossa aplicação se comunica com uma LLM (podendo ser OpenAI, Ollama, Gemini, Bedrock (se possśivel adicionar as imagens dessas e de outras LLMs no slide)).

Com Quarkus Langchain4j você só precisa adicionar as dependências quarkus-langchain4j-ollama:

```xml
<dependency>
    <groupId>io.quarkiverse.langchain4j</groupId>
    <artifactId>quarkus-langchain4j-openai</artifactId>
</dependency>
<dependency>
    <groupId>io.quarkiverse.langchain4j</groupId>
    <artifactId>quarkus-langchain4j-ollama</artifactId>
</dependency>
<dependency>
  <groupId>io.quarkiverse.langchain4j</groupId>
  <artifactId>quarkus-langchain4j-watsonx</artifactId>
</dependency>
```

Adicionar uma interface na sua aplicação:

```java
@RegisterAiService
public interface DoctorAiService {

    String ask(String message);

}
```

Só que você precisa de prompts, que vai guiar a LLM em ser o mais precisa possível, evitando ambiguidade (engenharia de prompt).

```java
@RegisterAiService
public interface DoctorAiService {

    @SystemMessage("You are a medical expert...")
    @UserMessage("{message}")
    String ask(String message);

}
```

LLM são stateless, cada requisição é uma nova requisição e você precisa manter o estado da conversação com a LLM.



```java
@RegisterAiService(tools = {AgendaTools.class})
public interface DoctorAiService {

    @SystemMessage("You are a medical expert...")
    @UserMessage("{message}")
    String ask(@MemoryId String sessionId, String message);

}
```

LLM não são determinísticas e também não sabem como executar tarefas específicas do seu negócio e aplicação, com isso você pode declarar tools para que a LLM possa executar uma operação de forma determinística e utilizando o seu código (resuma isso pra mim).

```java
public class AgendaTools {

    @Inject
    AgendaRepository repo;

    public Agenda getAgenda() {
        return repo.availableAgenda();
    }

}
```


```java
@RegisterAiService(tools = {AgendaTools.class})
public interface DoctorAiService {

    @SystemMessage("You are a medical expert...")
    @UserMessage("{message}")
    String ask(@MemoryId String sessionId, String message);

}
```
