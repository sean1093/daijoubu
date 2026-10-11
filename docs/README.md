# 文件索引

隨身旅伴 TravelBuddy 的所有文件。UI 與文件用繁體中文（台灣用語）；程式碼、註解、issue 與 PR 用英文。

| 文件 | 內容 | 給誰看 |
|---|---|---|
| [user-guide.md](user-guide.md) | 功能介紹、怎麼設定與分享、隱私、聽不到聲音、列印、常見問題 | 旅客、幫忙設定的家人 |
| [spec.md](spec.md) | 使用者與流程、每個功能的規格、路由、資料結構、分享連結、語音 | 產品、設計、開發 |
| [design.md](design.md) | 設計語言（和紙・柔和）：顏色、圖示、外框、字重、按鈕層級 | 改畫面的人 |
| [content-guide.md](content-guide.md) | 日文標記、插槽、禮貌用語、答案組、旅遊小抄、緊急電話、查證規則、怎麼新增情境 | 寫內容的人 |
| [development.md](development.md) | 環境、指令、專案結構、測試、截圖、部署、網址與儲存、工作流程 | 開發、維運 |
| [research.md](research.md) | 旅客痛點、競品分析、因此做了什麼和沒做什麼 | 決定功能的人 |
| [roadmap.md](roadmap.md) | 多國版本的做法、待辦與追蹤事項 | 規劃的人 |
| [changelog.md](changelog.md) | 依時間記錄的改版內容與 PR 連結 | 所有人 |
| [screenshots/](screenshots/) | 手機尺寸（390×844）的畫面截圖 | 所有人 |

## 幾個一定要知道的原則

- **給所有人用的服務：** UI 與文件不使用針對特定年齡層的稱呼（例如「長輩」）。大字、大按鈕、不打字，是為了讓任何人在慌亂時都能用。
- **不用 emoji：** 圖示一律用 `src/ui/dom.ts` 的線條圖示（見 [design.md](design.md)）。
- **緊急與醫療資訊一定要查證：** 每一筆都附來源和查證日期，查不到可靠來源就不放（見 [content-guide.md](content-guide.md)）。
- **不重做別人已經做好的工具：** 翻譯、地圖、叫車、警報交給專門的 App，我們專注在「拿給對方看、讓對方點答案、家人先填好」（見 [research.md](research.md)）。
