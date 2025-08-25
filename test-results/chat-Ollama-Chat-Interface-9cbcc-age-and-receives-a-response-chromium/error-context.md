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
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e21]: Hello, world!
        - generic [ref=e23]: 11:48:41 PM
      - generic [ref=e25]:
        - paragraph [ref=e27]: "Echo: Hello, world!"
        - generic [ref=e28]:
          - generic [ref=e29]: 11:48:41 PM
          - generic [ref=e30]: (llama2)
    - generic [ref=e31]:
      - textbox "Type your message here... (Press Enter to send, Shift+Enter for new line)" [ref=e32]
      - button "Send" [disabled] [ref=e33]
```