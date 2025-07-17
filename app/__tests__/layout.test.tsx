import { render, screen } from '@testing-library/react'
import RootLayout from '../layout' // テスト対象のコンポーネントをインポート

// 'describe' でテストのグループを定義
describe('RootLayout', () => {

  // 'it' または 'test' で個別のテストケースを定義
  it('renders children correctly', () => {
    // 1. レンダリング (Arrange)
    // RootLayoutコンポーネントを、テスト用のダミー子要素と一緒にレンダリングする
    render(
      <RootLayout>
        <div>ダミーのテスト用コンテンツ</div>
      </RootLayout>
    )

    // 2. 要素の検索 (Act)
    // 画面内に 'ダミーのテスト用コンテンツ' というテキストを持つ要素が存在するか探す
    const childElement = screen.getByText('ダミーのテスト用コンテンツ')

    // 3. 検証 (Assert)
    // 探し出した要素が、実際にドキュメント（画面）内に存在することを期待する
    expect(childElement).toBeInTheDocument()
  })
})