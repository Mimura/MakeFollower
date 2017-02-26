# pug,sass,TypeScript,gulpをつ方ハイカラなフロントエンド開発環境です
#####ついでにサーバサイドにRevel(Go言語)、エディタにVSCodeを使っています

## Getting Started
cloneして中に移動（Revelを使う場合は＄GOPATH/srcにcloneしてください）

npm install

GoとRevelは必要ならinstall

いらないなら

```
app/
conf/
messages/
tests/
```

はRevelで使われるフォルダなので消してください。

VSCodeを使わない人は.vscodeも消してください。

## gulpのタスク

それぞれのコンパイル用に
```
pug
sass
ts
```
タスクが用意してあります。

dev以下のそれぞれのフォルダから

htmlはView以下に

sassとTypeScriptはpublicのcssとjs以下に

sourceMapはpublicのMap以下に

出力されます。

ファイル変更があったら自動で更新するためのタスクは

default

として登録してあるのでこれを起動しておけばいいです。

（VSCodeのショートカットで呼ぶためにこんな名前ですが変えても動きます） 


