#・htmlで入力した値をcsvに書き込む //済
#・目標を入力できる箇所を作る //済
#・入力した値を目標等でスコア化し、総合での評価をする　//済

#・csvのデータをpythonで分析し、　　(頻度や推移をグラフ化する//済)
#・アプリ化する
#・レスポンシブデザイン化
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import plotly.graph_objs as go
#import plotly.offline as pyo
from datetime import datetime
from plotly.utils import PlotlyJSONEncoder
import json
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
plt.rcParams["font.family"]="Meiryo"

app = Flask(__name__, static_folder="build", static_url_path="/static")
CORS(app)
LIFE_LOG = "life_log.csv"

@app.route('/api/submit', methods=["POST"])
def submit_api():
    json_data = request.get_json()

    data = {
        "year": int(datetime.now().strftime("%Y")),
        "month": int(datetime.now().strftime("%m")),
        "day": int(datetime.now().strftime("%d")),
        "病気": int(json_data.get("desease", 0)),  # "1" or "0"
        "睡眠時間": float(json_data.get("slept_time", 0)),
        "朝食": int(json_data.get("breakfast", 0)),
        "昼食": int(json_data.get("lunch", 0)),
        "夕食": int(json_data.get("dinner", 0)),
        "運動時間": float(json_data.get("sports_time", 0)),
        "インプット時間": float(json_data.get("input_time", 0)),
        "アウトプット時間": float(json_data.get("output_time", 0)),
        "風呂": int(json_data.get("bath", 0)),  # 1 = 湯船、0.5 = シャワー、0 = 入ってない
        "スマホ時間": float(json_data.get("smartphone_time", 0)),
        "自慰回数": int(json_data.get("masturbations", 0)),
        "歯磨き回数": int(json_data.get("dentifrice", 0)),
        "フロス回数": int(json_data.get("dental_floss", 0)),
        "日記":str(json_data.get("journal","無し"))
    }
    # 目標値読み込み
    if os.path.exists("goal.json"):
        with open("goal.json", "r") as f:
            goal = json.load(f)
    # 目標達成記録用
    achieves = {
        "sleeptime_achieve":0,
        "exercisetime_achieve":0,
        "smartphone_achieve":0,
        "masturbation_achieve":0,
        "inputtime_achieve":0,
        "outputtime_achieve":0,
        "dentifrice_achieve":0,
        "dentalfloss_achieve":0,
    }
    # スコア計算
    score = 0
    sleeptime_goal = goal.get("sleeptime_goal", 540)
    exercisetime_goal = goal.get("exercisetime_goal", 30)
    smartphone_limit = goal.get("smartphone_limit", 60)
    masturbation_limit = goal.get("masturbation_limit", 0)
    inputtime_goal = goal.get("inputtime_goal", 60)
    outputtime_goal = goal.get("outputtime_goal", 120)
    dentifrice_goal = goal.get("dentifrice_goal", 2)
    dentalfloss_goal = goal.get("dentalfloss_goal", 1)
    #飯(1食毎に+5)
    if data["朝食"]==1:
        score +=5
    if data["昼食"]==1:
        score +=5
    if data["夕食"]==1:
        score +=5
    #風呂(湯船も=10,シャワーのみ=5)
    score += data["風呂"]*5
    # 睡眠（目標±30分なら10点）
    if abs(data["睡眠時間"] - sleeptime_goal) <= 30:
        score += 10
        achieves["sleeptime_achieve"] = 1
    # 運動（目標以上なら10点、半分以上なら5点）
    if data["運動時間"] >= exercisetime_goal:
        score += 10
        achieves["exercisetime_achieve"] = 1
    elif data["運動時間"] >= exercisetime_goal/ 2:
        score += 5
    # スマホ（目標以下なら10点）
    if data["スマホ時間"] <= smartphone_limit:
        score += 10
        achieves["smartphone_achieve"] = 1
    #オナニー（目標以下なら10点）
    if data["自慰回数"] <= masturbation_limit:
        score += 10
        achieves["masturbation_achieve"] = 1
    #インプット時間（目標以上なら10点、半分以上なら5点）
    if data["インプット時間"] >= inputtime_goal:
        score += 10
        achieves["inputtime_achieve"] = 1
    elif data["インプット時間"] >= inputtime_goal / 2:
        score += 5
    #アウトプット時間（目標以上なら10点、半分以上なら5点）
    if data["アウトプット時間"] >= outputtime_goal:
        score += 10
        achieves["outputtime_achieve"] = 1
    elif data["アウトプット時間"] >= outputtime_goal / 2:
        score += 5
    # 歯磨き回数（目標以上なら10点）
    if data["歯磨き回数"] >= dentifrice_goal:
        score += 10
        achieves["dentifrice_achieve"] = 1
    # フロス回数（目標以上なら10点）
    if data["フロス回数"] >= dentalfloss_goal:
        score += 10
        achieves["dentalfloss_achieve"] = 1
    #点数調整(95点(上記満点)だと+5点)
    if score == 95:
        score += 5
    data["スコア"] = score
   
    df_new = pd.DataFrame([data])
    achieve_new = pd.DataFrame([achieves])
    # ファイルがあれば読み込んで追加、なければ新規作成
    if os.path.exists(LIFE_LOG):
        df_existing = pd.read_csv(LIFE_LOG, encoding="utf-8-sig")
        df_combined = pd.concat([df_existing, df_new], ignore_index=True)
    else:
        df_combined = df_new

    df_combined.to_csv(LIFE_LOG, index=False, encoding="utf-8-sig")

    if os.path.exists("achieve_log.csv"):
        achieve_existing = pd.read_csv("achieve_log.csv", encoding="utf-8-sig")
        achieve_combined = pd.concat([achieve_existing, achieve_new], ignore_index=True)
    else:
        achieve_combined = achieve_new
    achieve_combined.to_csv("achieve_log.csv", index=False, encoding="utf-8-sig")

    return jsonify({"score": score})

@app.route("/api/goal")
def goal_api():
    if os.path.exists("goal.json"):
        with open("goal.json", "r", encoding="utf-8") as f:
            goal_data = json.load(f)
        return jsonify(goal_data)
    else:
        return jsonify({})
    
@app.route("/api/save_goal", methods=["POST"])
def save_goal_api():
    json_data = request.get_json()
    goal_file = "goal.json"
    if os.path.exists(goal_file):
        with open(goal_file, "r") as f:
            old_goal = json.load(f)
    else:
        old_goal = {}

    new_goal = {    
        "smartphone_limit": float(json_data.get("smartphone_limit", 0)),
        "masturbation_limit": int(json_data.get("masturbation_limit", 0)),
        "sleeptime_goal": float(json_data.get("sleeptime_goal", 0)),
        "exercisetime_goal": float(json_data.get("exercisetime_goal", 0)),
        "inputtime_goal": float(json_data.get("inputtime_goal", 0)),
        "outputtime_goal": float(json_data.get("outputtime_goal", 0)),
        "dentifrice_goal": int(json_data.get("dentifrice_goal", 0)),
        "dentalfloss_goal": int(json_data.get("dentalfloss_goal", 0)),
    }

    # 差分の検出
    changes = {
        key: {
            "old": old_goal.get(key, None),
            "new": new_goal[key]
        }
        for key in new_goal
        if old_goal.get(key) != new_goal[key]
    }

    log_entry = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "changed": changes
    }
    goal_log_path = "goal_log.json"
    if os.path.exists(goal_log_path):
        with open(goal_log_path, "r") as f:
            goal_log = json.load(f)
    else:
        goal_log = []

    goal_log.append(log_entry)

    with open(goal_log_path, "w") as f:
        json.dump(goal_log, f, ensure_ascii=False, indent=2)

    with open(goal_file, "w") as f:
        json.dump(new_goal, f, ensure_ascii=False, indent=2)

    return jsonify({"goal_data":new_goal})

@app.route("/api/analysis_graphs")
def analysis_graphs_api():
    items = request.args.getlist("item")
    group = request.args.get("group", "daily")    
    if not os.path.exists(LIFE_LOG):
        return "まだデータがありません"

    # データ読み込み
    df = pd.read_csv(LIFE_LOG, encoding="utf-8-sig")

    # 日付と数値に変換
    df["日時"] = pd.to_datetime(df[["year", "month", "day"]])

    # 時系列ソート
    df = df.sort_values("日時")

    # 週・月の集約処理
    if group == "weekly":
        df["period"] = df["日時"].dt.to_period("W").dt.start_time
    elif group == "monthly":
        df["period"] = df["日時"].dt.to_period("M").dt.start_time
    else:
        df["period"] = df["日時"]

    
    traces = []
    if "スコア" in df.columns:
        colors = [
            "yellow" if v == 100 else
            "red" if v < 60 else
            "blue"
            for v in df["スコア"]
        ]
        score_trace = go.Scatter(
            x=df["period"],
            y=df["スコア"],
            mode="markers+lines",
            name="スコア",
            marker=dict(color=colors, size=10),
            line=dict(color="lightgray"),
            yaxis="y"
        )
        traces.append(score_trace)

    # 選択項目の処理
    for item in items:
        if item not in df.columns or item == "スコア":
            continue
        trace = go.Scatter(
            x=df["period"],
            y=df[item],
            mode="lines+markers",
            name=item,
            marker=dict(color="purple",size=10),
            line=dict(color="orange"),
            yaxis="y2"
        )
        traces.append(trace)

    annotations = []
    shapes = []
    goal_log_path = "goal_log.json"
    if os.path.exists(goal_log_path):
        with open(goal_log_path, "r", encoding="utf-8") as f:
            goal_log = json.load(f)

        for entry in goal_log:
            date_str = entry["date"]
            try:
                date = pd.to_datetime(date_str)
            except Exception:
                continue

            if not entry.get("changed"):
                continue

            changes_text = "<br>".join([
                    f'{key.replace("_goal", "").replace("_limit", "")}: {val["old"]}→{val["new"]}'
                    for key, val in entry["changed"].items()
            ])

            max_y_value = df["スコア"].max() if "スコア" in df.columns else 200
            margin = 10
            annotations.append(
                dict(
                    x=date,
                    y=max_y_value + margin,
                    yref="y",
                    xref="x",
                    text="目標変更点",
                    hovertext=f"<br>{changes_text}",
                    hoverlabel=dict(bgcolor="white", font_size=12,font=dict(color="#1B758F")),
                    showarrow=False,
                    font=dict(color="red"),
                    bgcolor="white"
            ))
            
            shapes.append(
                dict(
                    type="line",
                    x0=date,
                    x1=date,
                    y0=0,
                    y1=1,
                    xref="x",
                    yref="paper",
                    line=dict(color="red", dash="dash"),
                ))
        

    layout = go.Layout(
        title="選択項目の推移（スコア低下をハイライト）",
        xaxis=dict(title="日付"),
        yaxis=dict(
            title="スコア",
            #titlefont=dict(color="gray"),
            tickfont=dict(color="gray")
        ),
        yaxis2=dict(
            title="選択項目",
            #titlefont=dict(color="blue"),
            tickfont=dict(color="orange"),
            overlaying="y",  # y軸の上に重ねる
            side="right"
        ),
        hovermode="closest",
        shapes=shapes,
        annotations=annotations,
    )
    
    fig = go.Figure(data=traces, layout=layout)
    graph_json = json.dumps(fig, cls=PlotlyJSONEncoder)

    column_order = [
            "year", "month", "day", "病気",
            "睡眠時間", "朝食", "昼食", "夕食",
            "運動時間", "インプット時間", "アウトプット時間",
            "風呂", "スマホ時間", "自慰回数",
            "歯磨き回数", "フロス回数", "スコア", "日記"
        ]

    if os.path.exists(LIFE_LOG):
        df = pd.read_csv(LIFE_LOG, encoding="utf-8-sig", usecols=column_order)

        df = df[column_order]
        df = df.where(pd.notnull(df), None)
        df_record = df.to_dict(orient='records')
    else:
        df_record=[]
        
    return jsonify({"graph_json": graph_json,"selected_item":", ".join(items),"group":group,"df":df_record})
@app.route("/api/analysis")
def analysis_api():
    achieve_data = None
    df = pd.read_csv(LIFE_LOG)
    if os.path.exists("achieve_log.csv"):
        achieve_data = pd.read_csv("achieve_log.csv")

    column_to_achieve_key = {
        "睡眠時間": "sleeptime_achieve",
        "スマホ時間": "smartphone_achieve",
        "自慰回数": "masturbation_achieve",
        "運動時間": "exercisetime_achieve",
        "インプット時間": "inputtime_achieve",
        "アウトプット時間": "outputtime_achieve",
        "歯磨き回数": "dentifrice_achieve",
        "フロス回数": "dentalfloss_achieve",
    }
    index_order = [
        "病気", 
        "睡眠時間", "朝食", "昼食", "夕食",
        "運動時間", "インプット時間", "アウトプット時間",
        "風呂", "スマホ時間", "自慰回数",
        "歯磨き回数", "フロス回数", "スコア",
    ]

    stats_list = []
    for item in index_order:
        if item not in df.columns:
            continue
        series = df[item].dropna()
        max = series.max()
        min = series.min()
        mean = round(series.mean(), 2)
        median = series.median()
        mode = series.mode().iloc[0] if not series.mode().empty else None
        std = round(series.std(), 2)

        achieve_key = column_to_achieve_key.get(item)
        if achieve_key and achieve_key in achieve_data.columns:
            achieve_rates = round((achieve_data[achieve_key].sum() / len(achieve_data[achieve_key])) * 100, 2)
        else:
            achieve_rates = None

        stats_list.append({
                "変数名": item,
                "最大値": max,
                "最小値": min,
                "平均": mean,
                "中央値": median,
                "最頻値": mode,
                "目標達成率(%)": achieve_rates,
                "標準偏差": std,
            })
    stats = pd.DataFrame(stats_list)
    stats = stats.fillna("-")
    stats["変数名"] = pd.Categorical(stats["変数名"], categories=index_order, ordered=True)
    stats = stats.sort_values("変数名").reset_index(drop=True)

    #print("aaa",stats)
    return stats.to_json(force_ascii=False)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    print(f"リクエストされたパス: {path}")
    if path.startswith("api/"):
        return "API endpoint not found", 404
    return send_from_directory(app.static_folder, "index.html")
    
@app.route('/bundle.js')
def serve_bundle():
    return send_from_directory(app.static_folder, 'bundle.js')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Render用
    app.run(host="0.0.0.0", port=port)