---
title: mini PCを買ってみた話
date: "2024-12-16"
description: "Amazonでmini PCを買っていろいろと試してみました。"
---

この記事は[coins Advent Calendar 2024](https://adventar.org/calendars/10367)16日目の記事です。

# はじめに

以前からサーバーとしてDeskmini H110を使っていたのですが、そろそろ古くなってきたうえ、消費電力も高かったので買い換えたいと思っていました。
ちょうどAmazonでmini PCがセールになっていたので購入してみました。（まあセールを使わずにストアクーポンを使ったほうが安かったのでセールは使ってないんですけどね。Amazonあるあるです。）

# 購入したmini PC

今回は[GMKtec Nucbox M5 Plus](https://www.amazon.co.jp/dp/B0CCSLMGM1?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1)を購入しました。
CPUはRyzen 7 5825U、メモリは16GB、ストレージは512GBのSSDです。OSはWindows 11 Proですが、こういう中華mini PCはなんでPro版を入れたがるんですかね......
普通に使うユーザーはHomeで十分ですし、サーバーとして使う人は何らかのLinuxを入れると思うのでよくわかりません。特にVolumeライセンスを入れちゃってるメーカーは一般ユーザーをあきらめてUbuntuでも入れておけばいいと思うんですが。


# とりあえず起動

一応Windows 11 ProのライセンスはとっておきたいのでLinuxのインストールメディアは横に置いておいて、普通に起動してみました。中華PCあるあるのセットアップ済みOSとか出てきたら面白いなあと思っていたのですが、普通にセットアップ画面が出てきました。
ただ、BypassNROをしなくてもローカルアカウントのセットアップになったので何かいじってあったんですかね。今回はライセンスをアカウントに紐づけたかったのでサインインするつもりだったのですがまあいいでしょう。
中華mini PCなのでとりあえず`slmgr /dli`でライセンスを確認して見ました。結果はRetail。Retail????このパターンは知りませんでした。VolumeライセンスはいろいろとまずいですがRetail搭載PCは売っていいんですかね？
Volumeライセンスだった時にクリーンインストールするとRetailになるって話をよく聞くのでその作業を工場でやってるんでしょうか。あれもどういう仕組み何でしょうね。

# OS選び

さて、このPCはサーバーとして使うのでOSを入れ替えるんですが何を入れるかはかなり迷いました。もともとのサーバーには気まぐれでLinux mintが入っていたのですが、最近ノートPCにManjaro Linuxを入れていろいろいじっていたのでManjaroのGnome版を入れてみました。しかしGnomeはやはりUbuntuと組み合わせたときに輝く気がするんですよね。設定にリモートデスクトップの設定があるのにgnome-remote-desktopが入ってないのでフリーズしたりといった具合に、あまりいい感じではなかったので別のOSを入れることにしました。そこで結局Ubuntu24.10をインストールしました。何気に純粋なUbuntuを使うのは5～6年ぶりです。

# xrdpのインストール

基本的にはsshでアクセスするのでGUIは不要なのですが、ごくまれにデスクトップ環境が欲しくなるのでxrdpをインストールしました。が、ここからが地獄でした。
aptでインストールするとなぜかx server could not be startedと出てログインできません。環境変数のDISPLAYを書き換えてみたり、コンフィグを書き換えてみたりしたのですがうまくいきません。
もはや何を触ったのか覚えていませんが最終的にxorgxrdpのバージョンとxrdpのバージョンがあっていない的なエラーが出ました。もういろいろとめんどくさくなってきたので最新版をソースからビルドしてインストールしました。

手順は[GithubのWiki](https://github.com/neutrinolabs/xrdp/wiki/Building-on-Debian-8)に書いてある通りですが、一応軽く書いておきます。
これを書いている時点での最新バージョンは0.10.1だったのでひとまずソースをダウンロードして配置します。
```bash
XRDP_SRC_DIR="${PWD}"/xrdp
wget https://github.com/neutrinolabs/xrdp/releases/download/v0.9.4/xrdp-0.10.1.tar.gz
tar xvzf xrdp-0.10.1.tar.gz
mv xrdp-0.10.1 "${XRDP_SRC_DIR}"
cd "${XRDP_SRC_DIR}"
```
次に依存関係のインストールを行います。
```bash
wget https://raw.githubusercontent.com/neutrinolabs/xrdp/refs/heads/devel/scripts/install_xrdp_build_dependencies_with_apt.sh
sudo ./scripts/install_xrdp_build_dependencies_with_apt.sh max
```
次にビルドを行います。
```bash
./bootstrap
./configure --enable-fuse --enable-mp3lame --enable-pixman
make
```
最後にインストールします。
```bash
cd "${XRDP_SRC_DIR}"
sudo make install
sudo ln -s /usr/local/sbin/xrdp{,-sesman} /usr/sbin
```

これでxrdpがインストールできました。次にxorgxrdpをビルドしてインストールします。
```bash
wget https://raw.githubusercontent.com/neutrinolabs/xorgxrdp/refs/heads/devel/scripts/install_xorgxrdp_build_dependencies_with_apt.sh
sudo ./install_xorgxrdp_build_dependencies_with_apt.sh max
```
そして最新バージョン、0.10.2をダウンロードします。
```bash
XORG_XRDP_SRC_DIR="${PWD}"/xorgxrdp
wget https://github.com/neutrinolabs/xorgxrdp/releases/download/v0.10.2/xorgxrdp-0.10.1.tar.gz
tar xvzf xorgxrdp-0.10.2.tar.gz
mv xorgxrdp-0.10.2 xorgxrdp
```
後はビルドしてインストールして完了です。
```bash
cd "${XORG_XRDP_SRC_DIR}"
./bootstrap
./configure
make
sudo make install
```
ひとまずデフォルトで十分なのでConfigure xrdpは無視しておきます。後はdaemonを開始して完了です。
```bash
sudo systemctl enable xrdp
sudo service xrdp start
```

これで無事に接続できました。ついでにログイン画面の画像も新しい感じになっていました。

# おわりに

なぜかxrdpに関する内容が大半を占めていた気がしますがこんな感じで無事セットアップできました。外部に公開するものではないのでfirewall等は設定していません。
そのあたりはまたやりたくなった時にやりたいと思います。

本当はBlogを作った話でも書こうと思ったのですが、未完成で画像を扱う機能すらないため緊急で別の内容を書きました。（remark、rehypeでmarkdownを変換しているだけな上に、Cloudflare Pagesでホスティングしているので本当に書くことがない）もう一つこれよりは技術的なネタがあるんですがそれはまたどこかで供養します。それでは。