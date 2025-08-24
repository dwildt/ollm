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
            - option "llama2"
            - option "mistral" [selected]
        - generic [ref=e16]: 🟢 Connected
        - button "Clear Chat" [ref=e17] [cursor=pointer]
    - generic [ref=e18]:
      - generic [ref=e20]:
        - generic [ref=e21]: Test with mistral
        - generic [ref=e23]: 11:52:54 AM
      - generic [ref=e25]:
        - paragraph [ref=e27]: "Echo: Test with mistral"
        - generic [ref=e28]:
          - generic [ref=e29]: 11:52:54 AM
          - generic [ref=e30]: (mistral)
    - generic [ref=e31]:
      - textbox "Type your message here... (Press Enter to send, Shift+Enter for new line)" [ref=e32]
      - button "Send" [disabled] [ref=e33]
```