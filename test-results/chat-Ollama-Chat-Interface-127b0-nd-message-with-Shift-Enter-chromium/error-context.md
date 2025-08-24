# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - heading "Ollama Chat Interface" [level=1] [ref=e7]
        - group "Language selection" [ref=e8]:
          - button "EN" [ref=e9] [cursor=pointer]
          - button "PT" [ref=e10] [cursor=pointer]
      - generic [ref=e11]:
        - generic [ref=e12]:
          - generic [ref=e13]: "Model:"
          - combobox "Model:" [ref=e14]:
            - option "llama2" [selected]
            - option "mistral"
        - generic [ref=e16]: 🟢 Connected
        - button "Clear Chat" [ref=e17] [cursor=pointer]
    - generic [ref=e19]:
      - heading "Welcome to Ollama Chat!" [level=2] [ref=e20]
      - paragraph [ref=e21]: Start a conversation by typing a message below.
    - generic [ref=e22]:
      - textbox "Type your message here... (Press Enter to send, Shift+Enter for new line)" [active] [ref=e23]: Line 1 Line 2
      - button "Send" [ref=e24] [cursor=pointer]
```