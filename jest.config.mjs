import nextJest from 'next/jest.js'

// Next.jsからcreateJestConfigをインポートし、テスト環境へのパスを設定
const createJestConfig = nextJest({
  // Next.jsアプリの場所を指定し、テスト環境でnext.config.jsと.envファイルを読み込ませる
  dir: './',
})

// Jestに渡すカスタム設定を追加
/** @type {import('jest').Config} */
const customJestConfig = {
  // 各テストの実行前に、追加のセットアップを行うファイルを指定
  // ここで@testing-library/jest-domなどを読み込む
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // テスト環境として、ブラウザ環境をシミュレートするjsdomを指定
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfigをエクスポートし、next/jestが非同期でNext.jsの設定を読み込めるようにする
export default createJestConfig(customJestConfig)   