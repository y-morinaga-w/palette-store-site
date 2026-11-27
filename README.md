# ぱれっとすとあ 公式サイト

## ページの構成

- 通常のページは `/<言語>/<ページ>/` に置きます。トップは `/ja/`、日本語のプライバシーポリシーは `/ja/privacy/` です。`/privacy/<言語>/` のようにページを先に置く構成も検討しました。言語を先に置くと、トップ・プライバシー・サポート・利用規約を言語ごとにまとめられ、別のゲームを追加する場合も `/<言語>/<ゲーム>/<ページ>/` にまとめられます。
- `/` と `/index.html`、従来の `/privacy*.html` は、短い HTML から新しいページに転送します。`canonical` には独自ドメインの新 URL を指定しています。旧 GitHub Pages ドメインからは、GitHub が独自ドメイン上の同じパスへ転送します。
- 共通のスタイルは [assets/site.css](assets/site.css) にあります。プライバシーポリシーは従来と同じ順序の言語ナビで、各言語のページへ移動できます。
- 招待リンクは全言語で `/join?code=ABCD2345` を使います。案内の初期表示はブラウザの言語設定に合わせ、言語ナビから切り替えられます。言語ナビには URL のフラグメントを使うので、切り替えてもあいことばを含む URL を再取得しません。対応外の言語では英語を表示します。
- `join/index.html` を案内ページの原本とし、Jekyll が `join.html` に同じ内容を出力します。GitHub Pages は `/join` を `join.html`、`/join/` を `join/index.html` から配信できます。

App Store と Google Play の URL が決まったら、[join/invite.js](join/invite.js) の先頭にある `storeUrls` にそれぞれ入れてください。設定したリンクが全言語で表示されます。

## 配信準備でアプリと関連付ける

2 ファイルは配信準備まで空の設定で公開します。`_config.yml` の `include` で、Jekyll の公開対象に `.well-known` を追加しています。

### iOS ユニバーサルリンク

1. 配信用の Apple Team ID と Bundle ID を確認します。署名済みアプリの `application-identifier` が `<App ID Prefix>.<Bundle ID>` となるので、その値を使います。App ID Prefix は通常 Team ID と同じです。
2. [.well-known/apple-app-site-association](.well-known/apple-app-site-association) の `applinks.details` に配信アプリを追加します。パスは `/join` に限定し、クエリの `code` はアプリで読み取ります。ファイル名は拡張子なしのままにします。

   ```json
   {
     "applinks": {
       "details": [
         {
           "appIDs": ["APP_ID_PREFIX.BUNDLE_ID"],
           "components": [{ "/": "/join" }]
         }
       ]
     }
   }
   ```

3. アプリ側の Associated Domains に `applinks:palettestore.crois-studio.com` を設定し、配信ビルドで確認します。

Apple は拡張子なしの所定 URL から、有効な証明書を使った HTTPS でリダイレクトなしに配信するよう案内しています。署名なしの JSON には `application/json` を使います。[Associated Domains](https://developer.apple.com/documentation/xcode/supporting-associated-domains)・[Apple の MIME 型の説明](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/Handoff/AdoptingHandoff/AdoptingHandoff.html)・[ユニバーサルリンクのデバッグ](https://developer.apple.com/documentation/technotes/tn3155-debugging-universal-links)

GitHub Pages 上の[公開サンプル](https://lichess-org.github.io/.well-known/apple-app-site-association)を `curl` で取得したところ、HTTP 200、`Content-Type: application/octet-stream` でした。このサイトの本番 URL の型は公開後に別途確認します。`application/json` での配信が必要な場合は、同じホスト・同じパスで該当レスポンスの `Content-Type` だけを変更できるリバースプロキシを使うか、ヘッダーを指定できるホスティングに移します。どちらも Apple には同じ URL から直接 HTTP 200 を返します。

### Android App Links

1. 配信版の `applicationId` と、Play Console の **アプリ署名鍵の証明書**に表示される SHA-256 フィンガープリントを確認します。
2. [.well-known/assetlinks.json](.well-known/assetlinks.json) の配列に次の要素を追加し、`PACKAGE_NAME` と `PLAY_APP_SIGNING_SHA256` を置き換えます。

   ```json
   [
     {
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "PACKAGE_NAME",
         "sha256_cert_fingerprints": ["PLAY_APP_SIGNING_SHA256"]
       }
     }
   ]
   ```

3. アプリ側の対象 Activity に次のフィルタを設定します。完全一致の `android:path="/join"` で、Android 14 以前でも対象パスを限定できます。

   ```xml
   <intent-filter android:autoVerify="true">
     <action android:name="android.intent.action.VIEW" />
     <category android:name="android.intent.category.DEFAULT" />
     <category android:name="android.intent.category.BROWSABLE" />
     <data android:scheme="https"
           android:host="palettestore.crois-studio.com"
           android:path="/join" />
   </intent-filter>
   ```

Google の要件に合わせて `assetlinks.json` を HTTPS から `application/json` で直接配信し、配信ビルドでリンクを確認します。[ウェブサイトの関連付け](https://developer.android.com/training/app-links/configure-assetlinks)・[署名の確認](https://developer.android.com/training/app-links/faq)・[アプリ側フィルタ](https://developer.android.com/training/app-links/add-applinks)

## 公開後の確認

招待ページはクエリ付きで、関連付けファイルはリダイレクトを追わずに GET し、すべて HTTP 200 であることと `Content-Type` を確認します。関連付けファイルの本文も確認してください。

```sh
curl -fsS -i 'https://palettestore.crois-studio.com/join?code=ABCD2345'
curl -fsS -i 'https://palettestore.crois-studio.com/.well-known/apple-app-site-association'
curl -fsS -i 'https://palettestore.crois-studio.com/.well-known/assetlinks.json'
```
