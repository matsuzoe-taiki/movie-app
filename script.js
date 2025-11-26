// 検索ボタンと入力欄の取得
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const results = document.getElementById("results");

//APIキーを入力してください（自分のキーに置き換える）
const API_KEY = "b3d8c387"

//映画検索関数
async function searchMovies(query) {
    try {
        // スピナーを表示
        results.innerHTML = `<div class="loader"></div>`;
        //APIにアクセス
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
        );
        //JSONに変換
        const data = await response.json()
        console.log("APIからのレスポンス：", data);
        
        //結果が見当たらなかった場合
        if (data.response === "False") {
            results.innerHTML = `<p>検索結果が見つかりませんでした。</p>`; //一旦リセット
            return;
        }
        //結果がある場合
        results.innerHTML="";//一旦リセット
        data.Search.forEach(movie => {
            const div = document.createElement("div");
            div.classList.add("movie-card");//<-カードクラス追加
            div.innerHTML = `<img src="${movie.Poster !=="N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="Poster"><h3>${movie.Title}</h3><p>公開年：${movie.Year}</p>`;
            results.appendChild(div);//resultsの子要素としてDOMにdivを追加する
        });
    } catch (error) {
        console.error("エラー：", error);
        results.innerHTML = `<p>データ取得中にエラーが発生しました。</p>`;
    };
    }


// ボタンがクリックされたときの処理
searchBtn.addEventListener("click", ()=> {
    // 入力欄の値を取得
    const query = movieInput.value.trim();// trimで前後の余計なスペースを削除する。

    // 空だったら警告を出す
    if (query === "") {
        alert("映画タイトルを入力してください!!");
        return;
    }
    searchMovies(query);//API呼び出し
});

// 検索実行用の共通関数
function handleSearch() {
    const query = movieInput.value.trim();
    if (query === "") {
        alert("映画タイトルを入力してください!");
        return ;
    }
    searchMovies(query); //API呼び出し
};
// ボタンクリック時の処理
searchBtn.addEventListener("click", handleSearch);

// Enterキー押した時の処理
movieInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});