# k_front
承知いたしました。
フロントエンド開発をスムーズに進めるために、あらかじめ明確なルールと設計方針を定めることは非常に重要です。ご提示いただいた要件を基に、より実践的で詳細なフロントエンド設計規約を定義します。

---

### **フロントエンド詳細設計規約: ケイカくん**

**1. 基本的な設計思想**

*   **コンポーネント指向**: UIを再利用可能な小さなコンポーネントに分割し、それらを組み合わせてページを構築する。
*   **関心の分離**: 「データ取得ロジック」「データ変換ロジック」「UIコンポーネント」の責務を明確に分離する。
*   **型安全**: TypeScriptを最大限に活用し、APIレスポンスからUIのPropsまで、厳格な型定義を行う。

**2. ディレクトリ構成とファイル配置**

Next.js App Routerの規約に則りつつ、アプリケーションの規模拡大に対応できる構造を定義します。

```
keikakun_front/
├── app/
│   ├── (auth)/                # 認証関連ページグループ (ログイン、サインアップ)
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/                # メイン機能ページグループ (ヘッダー・フッター共有)
│   │   ├── dashboard/
│   │   │   ├── components/      # ダッシュボードページ専用のコンポーネント
│   │   │   │   ├── DashboardTable.tsx
│   │   │   │   └── CreateRecipientButton.tsx
│   │   │   └── page.tsx         # ダッシュボードのルート (サーバーコンポーネント)
│   │   ├── recipients/
│   │   │   ├── [id]/
│   │   │   │   ├── plan/        # /recipients/[id]/plan
│   │   │   │   │   ├── components/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── edit/        # /recipients/[id]/edit
│   │   │   │       └── page.tsx
│   │   │   └── new/             # /recipients/new
│   │   │       └── page.tsx
│   │   └── layout.tsx           # メイン機能の共通レイアウト (ヘッダー/フッター)
│   ├── api/                     # Next.jsのAPI Routes (BFFとして利用する場合)
│   ├── globals.css
│   └── layout.tsx               # ルートレイアウト (<html>, <body>)
│
├── components/                  # ★ 全アプリケーションで共通のUIコンポーネント
│   ├── ui/                      # shadcn/uiで生成される基本部品 (Button, Input等)
│   ├── common/                  # 複数のページで使われる共通部品
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PageSpinner.tsx
│   └── icons/                   # カスタムアイコンコンポーネント
│
├── lib/                         # ★ データ取得・外部サービス連携ロジック
│   ├── api/                     # バックエンドAPIを呼び出す関数群
│   │   ├── dashboardApi.ts
│   │   ├── recipientApi.ts
│   │   └── index.ts             # 各API関数をまとめてエクスポート
│   ├── supabase/                # Supabaseクライアントの初期化・設定
│   └── stripe/                  # Stripe.jsのラッパー関数など
│
├── styles/                      # グローバルなCSSやテーマ設定
│
├── types/                       # ★ アプリケーション全体の型定義
│   ├── api/                     # APIレスポンスの型
│   │   ├── dashboard.d.ts
│   │   └── recipient.d.ts
│   └── index.d.ts               # グローバルな型やEnum
│
├── hooks/                       # ★ カスタムフック
│   ├── useAuth.ts               # 認証状態を管理するフック
│   └── useMediaQuery.ts         # メディアクエリ用のフック
│
└── ... (設定ファイル: next.config.js, tsconfig.json, etc.)
```

**【決定事項】**
*   **共通コンポーネント**: 複数のページで再利用するコンポーネントは`components/common/`に配置する。
*   **ページ専用コンポーネント**: 特定のページ（例: `/dashboard`）でしか使わないコンポーネントは、そのページの`components/`ディレクトリに配置する。
*   **型定義**: APIのレスポンスやリクエストの型は`types/api/`に、アプリケーション全体で使うEnumなどは`types/index.d.ts`にまとめる。

---

**3. 命名規則**

*   **ファイル名**:
    *   コンポーネント、フック、APIファイル: **パスカルケース (PascalCase)**
        *   例: `DashboardTable.tsx`, `useAuth.ts`, `DashboardApi.ts`
    *   型定義ファイル: **ケバブケース (kebab-case)**
        *   例: `dashboard.d.ts`
*   **関数・変数名**: **キャメルケース (camelCase)**
    *   例: `const getUserProfile = ...`, `const isLoading = ...`
*   **API取得関数**: `get`, `create`, `update`, `delete` などの動詞で始め、対象リソースを続ける。
    *   例: `getDashboardSummaries()`, `createRecipient()`

---

**4. 状態管理とデータ取得**

*   **サーバーサイドでのデータ取得**: サーバーコンポーネントでは、原則として`async/await`を使い、`lib/api/`に定義したAPI取得関数を直接呼び出す。
*   **クライアントサイドでのデータ取得**: クライアントコンポーネントでは、**SWR**または**TanStack Query**を使い、サーバーの状態（DBのデータ）を管理する。これにより、キャッシュ、再検証、ローディング/エラー状態の管理が容易になる。
    *   例: `const { data, isLoading, error } = useSWR('/api/v1/dashboard', fetcher);`
*   **UIの状態**: `useState`, `useReducer` を使い、コンポーネントローカルな状態（フォーム入力値、モーダルの開閉など）を管理する。
*   **グローバルな状態**: 認証情報（ユーザーオブジェクト、ログイン状態）など、複数のコンポーネントで共有する状態は、**Context API**とカスタムフック（例: `useAuth`）を組み合わせて管理する。

---

**5. レスポンシブデザイン**

*   **PCページ**: **Tailwind CSS**のブレークポイント（`md:`, `lg:`など）を最大限に活用し、レスポンシブデザインを実装する。
*   **モバイルページ**:
    *   基本はTailwind CSSのモバイルファーストアプローチで構築する。
    *   ご指定の`react-masonry-css`は、ダッシュボードや画像一覧など、**要素の高さが不揃いなグリッドレイアウト**を実装したい場合に限定して利用する。
    *   メディアクエリの判定には、`use-media`ライブラリやカスタムフック(`useMediaQuery`)を利用し、クライアントサイドでのレンダリング切り替えを安全に行う。

---

**6. API連携とデータ変換**

*   **API取得関数 (`lib/api/`)**: バックエンドAPIのエンドポイントを直接叩く責務を持つ。Axiosや標準`fetch`をラップして実装する。
*   **データ変換**: APIから取得した生データ（例: `snake_case`のキー、ISO文字列の日付）を、UIコンポーネントが使いやすい形式（例: `camelCase`のキー、`Date`オブジェクト）に変換する処理は、**各API取得関数内**で行うか、専用の`transformers`ディレクトリを`lib/`配下に作成して管理する。

```typescript
// lib/api/recipientApi.ts
import { recipientTransformer } from '../transformers/recipientTransformer';

export const getRecipientById = async (id: string): Promise<Recipient> => {
  const response = await apiClient.get(`/recipients/${id}`);
  // APIレスポンスをUIで使いやすい形に変換してから返す
  return recipientTransformer.toViewModel(response.data);
};
```