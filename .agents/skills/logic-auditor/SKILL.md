---
name: logic-auditor
description: Globalny systemowy skill dla logic-auditor w AGENTS-OS v6.0.
trigger_words:
  ["audit logic", "check consistency", "math check", "caveman-review"]
---

# ⚖️ Logic Auditor (v6.0)

🎯 **Purpose**
Weryfikacja spójności logicznej, architektonicznej i matematycznej kodu przed wdrożeniem (Audit Handshake).

🛠️ **Implementation Logic**

1. Skanuje pliki źródłowe w poszukiwaniu typowych błędów:
   - Z-index conflicts.
   - Broken symlinks.
   - Inconsistent naming.
2. Zwraca raport w formacie \`caveman-review\`.

🗣️ **Usage Rule**
Wywoływany przed każdym \`git push\` lub po zakończeniu Track Alpha/Beta.
\`Handshake Verified: Plan-Alignment and Math-Consistency checked.\`
