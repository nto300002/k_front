# --- ステージ 1: 依存関係のインストール ---
# 目的: npmの依存関係をインストールする。このステージはpackage-lock.jsonが
#       変更されない限りキャッシュされ、ビルド時間を短縮します。
FROM node:22.14.0 AS deps
WORKDIR /app

# package.jsonとlockファイルをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm install --frozen-lockfile


# --- ステージ 2: アプリケーションのビルド ---
# 目的: ソースコードを基に、本番用のNext.jsアプリケーションをビルドする。
FROM node:22.14.0 AS builder
WORKDIR /app

# ステージ1でインストールしたnode_modulesをコピー
COPY --from=deps /app/node_modules ./node_modules
# アプリケーションの全ソースコードをコピー
COPY . .

# Next.jsアプリをビルド
# NEXT_TELEMETRY_DISABLED=1 はビルド時にVercelへのテレメトリ送信を無効化するおまじない
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# --- ステージ 3: 本番環境用の実行イメージ ---
# 目的: ビルド成果物のみを含む、軽量でセキュアな最終イメージを作成する。
FROM node:22.14.0 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# セキュリティ向上のため、非rootユーザーでアプリケーションを実行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# builderステージから必要な成果物のみをコピー
COPY --from=builder /app/app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.js 13以降のスタンドアロン出力をコピー
# これにより、必要最低限のファイルのみでサーバーを起動できる
# next.config.jsで `output: 'standalone'` の設定が必要です
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

# サーバーを起動
CMD ["node", "server.js"]