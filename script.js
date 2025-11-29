// 検索ボタンと入力欄の取得
const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const results = document.getElementById("results");
const favoritesList = document.getElementById("favoritesList");

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
            div.innerHTML = `<img src="${movie.Poster !=="N/A" ? movie.Poster : "https://via.placeholder.com/150"}" alt="Poster"><h3>${movie.Title}</h3><p>公開年：${movie.Year}</p><button class="favorite-btn" data-id="${movie.imdbID}">⭐️お気に入りに追加</button>`;

            results.appendChild(div);//resultsの子要素としてDOMにdivを追加する
        });

        // 全てのお気に入りボタンにクリックイベントを設定
        const favButtons = document.querySelectorAll(".favorite-btn");
        // お気に入り追加ボタンクリック時
        favButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const movieId = btn.dataset.id;
                const movieTitle = btn.closest(".movie-card").querySelector("h3").innerText;
                const movieYear = btn.closest(".movie-card").querySelector("p").innerText.replace("公開年：", "");
                const moviePoster = btn.closest(".movie-card").querySelector("img").src;

                // 既存の起きに入りを取得（存在しなければ空配列）
                const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

                // 重複登録防止
                if (favorites.some((m) => m.id === movieId)) {
                    alert("この映画はすでにお気に入り登録されています。");
                    return;
                }

                // 新しい映画のデータを追加
                favorites.push({id: movieId, title:movieTitle, year: movieYear, poster: moviePoster});

                // localStorageに保存
                localStorage.setItem("favorites", JSON.stringify(favorites));
                // 追加完了メッセージを表示
                const msg = document.createElement("p");
                msg.innerText = `"${movieTitle}"をお気に入りに追加しました!`;
                msg.classList.add("save-msg");//CSSでスタイル調整できる
                document.body.appendChild(msg);

                setTimeout(() => msg.remove(), 2000);

                //再描画
                renderFavorites();
            });
        });

    } catch (error) {
        console.error("エラー：", error);
        results.innerHTML = `<p>データ取得中にエラーが発生しました。</p>`;
    };
    }

// 全てのお気に入りボタンにクリックイベントを設定
const favButtons = document.querySelectorAll(".favorite-btn");
favButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const movieId = btn.dataset.id;
        // ここまではまだlocalStorageに保存せず、ログで確認できるようにしておく
    });
});

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

function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log(favorites)
    favoritesList.innerHTML = "";

    favorites.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add("favorite-card");
        div.innerHTML = `<img src="${movie.poster !== "N/A" ? movie.poster : "https://via.placeholder.com/150"}" alt="Poster"><h3>${movie.title}</h3><p>公開年：${movie.year}</p><button class="delete-btn" data-id="${movie.id}">🙅削除</button>`;
        favoritesList.appendChild(div);

        // 削除ボタンのイベントリスナー
        div.querySelector(".delete-btn").addEventListener("click", () => {
            const updatedFavorites = favorites.filter((m) => m.id !==movie.id);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

            //削除完了メッセージを表示（2秒で消える）
            const msg = document.createElement("p");
            msg.innerText = `"${movie.title}"をお気に入りから削除しました。`;
            msg.classList.add("delete-msg");
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 2000);

            // 再描画
            renderFavorites();
        });
    });
}
renderFavorites();
