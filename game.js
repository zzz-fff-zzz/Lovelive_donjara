// 游戏状态
const GameState = {
    IDLE: 'idle',
    PLAYING: 'playing',
    ENDED: 'ended'
};

// 玩家类型
const PlayerType = {
    HUMAN: 'human',
    AI: 'ai'
};

// 游戏对象
const game = {
    state: GameState.IDLE,
    players: [],
    currentPlayerIndex: 0,
    deck: [],
    discardedTiles: [],
    playerDiscardedTiles: [[], [], [], []], // 每个玩家的弃牌堆
    selectedTile: null,
    showCharacterInfo: false, // 控制是否显示角色信息
    isRiichi: [false, false, false, false], // 每个玩家是否立直
    riichiTileIndex: [-1, -1, -1, -1], // 每个玩家立直时的弃牌索引
    showRiichiButtons: false, // 是否显示立直宣告按钮
    pendingNextPlayer: false, // 是否等待玩家决定后再下一个玩家
    lastDrawnTile: [null, null, null, null], // 每个玩家刚摸到的牌
    playerChiTiles: [[], [], [], []], // 每个玩家的吃牌区
    chiCount: [0, 0, 0, 0], // 每个玩家的吃牌次数
    lastDiscardedTile: null, // 上一位玩家刚打出的牌（用于吃牌判断）
    lastDiscardingPlayerIndex: -1, // 上一位打出牌的玩家索引（用于吃牌判断）
    globalLastDiscardedTile: null, // 所有玩家中最后被打出的牌（用于显示红色边框）
    globalLastDiscardingPlayerIndex: -1, // 所有玩家中最后打出牌的玩家索引（用于显示红色边框）
    showChiButtons: false, // 是否显示吃牌按钮
    canChi: false, // 当前玩家是否可以吃牌
    chiAvailableTiles: [], // 可以用来吃牌的所有候选牌
    chiSelectedTiles: [], // 用户已选择用来吃牌的牌
    chiStep: 1, // 吃牌步骤：1=选择吃/不吃，2=选择牌，3=确认
    showHuButtons: false, // 是否显示胡牌按钮
    pendingRonTile: null, // 待胡的荣和牌
    pendingRonPlayerIndex: -1, // 待胡的玩家索引
    timers: [], // 存储所有定时器ID，用于重新开始时清除
    isMobile: false, // 是否是移动设备
    // 每个小组的全部成员名单
    groupMembers: {
        "Printemps": ["高坂穗乃果", "南小鸟", "小泉花阳"],
        "BiBi": ["绚濑绘里", "西木野真姬", "矢泽妮可"],
        "Lily white": ["园田海未", "星空凛", "东条希"],
        "CYaRon!": ["高海千歌", "渡边曜", "黑泽露比"],
        "Guilty Kiss": ["樱内梨子", "津岛善子", "小原鞠莉"],
        "AZALEA": ["松浦果南", "黑泽黛雅", "国木田花丸"],
        "A・ZU・NA": ["上原步梦", "樱坂雫", "优木雪菜"],
        "DiverDiva": ["朝香果林", "宫下爱"],
        "QU4RTZ": ["中须霞", "近江彼方", "艾玛·维尔德", "天王寺璃奈"],
        "R3BIRTH": ["三船栞子", "米娅·泰勒", "钟岚珠"],
        "CatChu": ["涩谷香音", "平安名堇", "米女芽衣"],
        "KALEIDOSCORE": ["唐可可", "叶月恋", "薇恩·玛格丽特"],
        "5yncri5e!": ["岚千砂都", "樱小路希奈子", "若菜四季", "鬼冢夏美", "鬼冢冬毬"],
        "Cerise Bouquet": ["日野下花帆", "百生吟子"],
        "DOLLCHESTRA": ["村野沙耶香", "徒町小铃"],
        "Mira-Cra Park!": ["大泽瑠璃乃", "安养寺姬芽"],
        "Edel Note": ["塞拉斯·柳田·利林费尔德", "桂城泉"]
    },
    // 生日月份分数配置（每个生日月份对应的额外分数）
    birthdayMonthScores: {
        1: 60000,
        2: 60000,
        3: 120000,
        4: 60000,
        5: 120000,
        6: 60000,
        7: 120000,
        8: 60000,
        9: 60000,
        10: 120000,
        11: 120000,
        12: 120000
    },
    // 小组分数配置（每个小组对应的额外分数）
    groupScores: {
        "Printemps": 120000,
        "BiBi": 120000,
        "Lily white": 120000,
        "CYaRon!": 120000,
        "Guilty Kiss": 120000,
        "AZALEA": 120000,
        "A・ZU・NA": 120000,
        "DiverDiva": 90000,
        "QU4RTZ": 150000,
        "R3BIRTH": 120000,
        "CatChu": 120000,
        "KALEIDOSCORE": 120000,
        "5yncri5e!": 180000,
        "Cerise Bouquet": 90000,
        "DOLLCHESTRA": 90000,
        "Mira-Cra Park!": 90000,
        "Edel Note": 90000
    },
    // 系列的排序顺序
    seriesOrder: ["μ's", "Aqours", "虹咲", "Liella!", "莲之空", "人生不易部!", "音乐剧"],
    // 校园IP牌库数据
    cards: [
        {id: 1, name: '高坂穗乃果', type: 'member', series: 'μ\'s', group: 'Printemps', grade: 2, birthdayMonth: 8, imageUrl: 'imgs/高坂穗乃果.jpg'},
        {id: 2, name: '绚濑绘里', type: 'member', series: 'μ\'s', group: 'BiBi', grade: 3, birthdayMonth: 10, imageUrl: 'imgs/绚濑绘里.jpg'},
        {id: 3, name: '南小鸟', type: 'member', series: 'μ\'s', group: 'Printemps', grade: 2, birthdayMonth: 9, imageUrl: 'imgs/南小鸟.jpg'},
        {id: 4, name: '园田海未', type: 'member', series: 'μ\'s', group: 'Lily white', grade: 2, birthdayMonth: 3, imageUrl: 'imgs/园田海未.jpg'},
        {id: 5, name: '星空凛', type: 'member', series: 'μ\'s', group: 'Lily white', grade: 1, birthdayMonth: 11, imageUrl: 'imgs/星空凛.jpg'},
        {id: 6, name: '西木野真姬', type: 'member', series: 'μ\'s', group: 'BiBi', grade: 1, birthdayMonth: 4, imageUrl: 'imgs/西木野真姬.jpg'},
        {id: 7, name: '东条希', type: 'member', series: 'μ\'s', group: 'Lily white', grade: 3, birthdayMonth: 6, imageUrl: 'imgs/东条希.jpg'},
        {id: 8, name: '小泉花阳', type: 'member', series: 'μ\'s', group: 'Printemps', grade: 1, birthdayMonth: 1, imageUrl: 'imgs/小泉花阳.jpg'},
        {id: 9, name: '矢泽妮可', type: 'member', series: 'μ\'s', group: 'BiBi', grade: 3, birthdayMonth: 7, imageUrl: 'imgs/矢泽妮可.jpg'},
        {id: 10, name: 'μ\'s校徽', type: 'wildcard', series: 'μ\'s', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/μ\'s校徽.jpg'},
        {id: 11, name: 'μ\'s团标', type: 'wildcard', series: 'μ\'s', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/μ\'s团标.jpg'},

        {id: 12, name: '高海千歌', type: 'member', series: 'Aqours', group: 'CYaRon!', grade: 2, birthdayMonth: 8,
        imageUrl: 'imgs/高海千歌.jpg'},
        {id: 13, name: '樱内梨子', type: 'member', series: 'Aqours', group: 'Guilty Kiss', grade: 2, birthdayMonth: 9,
        imageUrl: 'imgs/樱内梨子.jpg'},
        {id: 14, name: '松浦果南', type: 'member', series: 'Aqours', group: 'AZALEA', grade: 3, birthdayMonth: 2,
        imageUrl: 'imgs/松浦果南.jpg'},
        {id: 15, name: '黑泽黛雅', type: 'member', series: 'Aqours', group: 'AZALEA', grade: 3, birthdayMonth: 1,
        imageUrl: 'imgs/黑泽黛雅.jpg'},
        {id: 16, name: '渡边曜', type: 'member', series: 'Aqours', group: 'CYaRon!', grade: 2, birthdayMonth: 4,
        imageUrl: 'imgs/渡边曜.jpg'},
        {id: 17, name: '津岛善子', type: 'member', series: 'Aqours', group: 'Guilty Kiss', grade: 1, birthdayMonth: 7,
        imageUrl: 'imgs/津岛善子.jpg'},
        {id: 18, name: '国木田花丸', type: 'member', series: 'Aqours', group: 'AZALEA', grade: 1, birthdayMonth: 3,
        imageUrl: 'imgs/国木田花丸.jpg'},
        {id: 19, name: '小原鞠莉', type: 'member', series: 'Aqours', group: 'Guilty Kiss', grade: 3, birthdayMonth: 6,
        imageUrl: 'imgs/小原鞠莉.jpg'},
        {id: 20, name: '黑泽露比', type: 'member', series: 'Aqours', group: 'CYaRon!', grade: 1, birthdayMonth: 9,
        imageUrl: 'imgs/黑泽露比.jpg'},
        {id: 21, name: 'Aqours校徽', type: 'wildcard', series: 'Aqours', group: '', grade: 0, birthdayMonth: 0,
        imageUrl: 'imgs/Aqours校徽.jpg'},
        {id: 22, name: 'Aqours团标', type: 'wildcard', series: 'Aqours', group: '', grade: 0, birthdayMonth: 0,
        imageUrl: 'imgs/Aqours团标.jpg'},

        {id: 23, name: '高咲侑', type: 'member', series: '虹咲', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/高咲侑.jpg'},
        {id: 24, name: '上原步梦', type: 'member', series: '虹咲', group: 'A・ZU・NA', grade: 2,
        birthdayMonth: 3, imageUrl: 'imgs/上原步梦.jpg'},
        {id: 25, name: '中须霞', type: 'member', series: '虹咲', group: 'QU4RTZ', grade: 1,
        birthdayMonth: 1, imageUrl: 'imgs/中须霞.jpg'},
        {id: 26, name: '樱坂雫', type: 'member', series: '虹咲', group: 'A・ZU・NA', grade: 1,
        birthdayMonth: 4, imageUrl: 'imgs/樱坂雫.jpg'},
        {id: 27, name: '朝香果林', type: 'member', series: '虹咲', group: 'DiverDiva', grade: 3,
        birthdayMonth: 6, imageUrl: 'imgs/朝香果林.jpg'},
        {id: 28, name: '宫下爱', type: 'member', series: '虹咲', group: 'DiverDiva', grade: 2,
        birthdayMonth: 5, imageUrl: 'imgs/宫下爱.jpg'},
        {id: 29, name: '近江彼方', type: 'member', series: '虹咲', group: 'QU4RTZ', grade: 3,
        birthdayMonth: 12, imageUrl: 'imgs/近江彼方.jpg'},
        {id: 30, name: '优木雪菜', type: 'member', series: '虹咲', group: 'A・ZU・NA', grade: 2,
        birthdayMonth: 8, imageUrl: 'imgs/优木雪菜.jpg'},
        {id: 31, name: '艾玛·维尔德', type: 'member', series: '虹咲', group: 'QU4RTZ', grade: 3,
        birthdayMonth: 2, imageUrl: 'imgs/艾玛·维尔德.jpg'},
        {id: 32, name: '天王寺璃奈', type: 'member', series: '虹咲', group: 'QU4RTZ', grade: 1,
        birthdayMonth: 11, imageUrl: 'imgs/天王寺璃奈.jpg'},
        {id: 33, name: '三船栞子', type: 'member', series: '虹咲', group: 'R3BIRTH', grade: 1,
        birthdayMonth: 10, imageUrl: 'imgs/三船栞子.jpg'},
        {id: 34, name: '米娅·泰勒', type: 'member', series: '虹咲', group: 'R3BIRTH', grade: 3,
        birthdayMonth: 12, imageUrl: 'imgs/米娅·泰勒.jpg'},
        {id: 35, name: '钟岚珠', type: 'member', series: '虹咲', group: 'R3BIRTH', grade: 2,
        birthdayMonth: 2, imageUrl: 'imgs/钟岚珠.jpg'},
        {id: 36, name: '虹咲校徽', type: 'wildcard', series: '虹咲', group: '', grade: 0,
        birthdayMonth: 0, imageUrl: 'imgs/虹咲校徽.jpg'},
        {id: 37, name: '虹咲团标', type: 'wildcard', series: '虹咲', group: '', grade: 0,
        birthdayMonth: 0, imageUrl: 'imgs/虹咲团标.jpg'},

        { id: 38, name: '涩谷香音', type: 'member', series: 'Liella!', group: 'CatChu', grade: 3, birthdayMonth: 5, imageUrl: 'imgs/涩谷香音.jpg' },
        { id: 39, name: '唐可可', type: 'member', series: 'Liella!', group: 'KALEIDOSCORE', grade: 3, birthdayMonth: 7, imageUrl: 'imgs/唐可可.jpg' },
        { id: 40, name: '岚千砂都', type: 'member', series: 'Liella!', group: '5yncri5e!', grade: 3, birthdayMonth: 2, imageUrl: 'imgs/岚千砂都.jpg' },
        { id: 41, name: '平安名堇', type: 'member', series: 'Liella!', group: 'CatChu', grade: 3, birthdayMonth: 9, imageUrl: 'imgs/平安名堇.jpg' },
        { id: 42, name: '叶月恋', type: 'member', series: 'Liella!', group: 'KALEIDOSCORE', grade: 3, birthdayMonth: 11, imageUrl: 'imgs/叶月恋.jpg' },
        { id: 43, name: '樱小路希奈子', type: 'member', series: 'Liella!', group: '5yncri5e!', grade: 2, birthdayMonth: 4, imageUrl: 'imgs/樱小路希奈子.jpg' },
        { id: 44, name: '米女芽衣', type: 'member', series: 'Liella!', group: 'CatChu', grade: 2, birthdayMonth: 10, imageUrl: 'imgs/米女芽衣.jpg' },
        { id: 45, name: '若菜四季', type: 'member', series: 'Liella!', group: '5yncri5e!', grade: 2, birthdayMonth: 6, imageUrl: 'imgs/若菜四季.jpg' },
        { id: 46, name: '鬼冢夏美', type: 'member', series: 'Liella!', group: '5yncri5e!', grade: 2, birthdayMonth: 8, imageUrl: 'imgs/鬼冢夏美.jpg' },
        { id: 47, name: '薇恩·玛格丽特', type: 'member', series: 'Liella!', group: 'KALEIDOSCORE', grade: 1, birthdayMonth: 1, imageUrl: 'imgs/薇恩·玛格丽特.jpg' },
        { id: 48, name: '鬼冢冬毬', type: 'member', series: 'Liella!', group: '5yncri5e!', grade: 1, birthdayMonth: 12, imageUrl: 'imgs/鬼冢冬毬.jpg' },
        { id: 49, name: 'Liella!校徽', type: 'wildcard', series: 'Liella!', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/Liella!校徽.jpg' },
        { id: 50, name: 'Liella!团标', type: 'wildcard', series: 'Liella!', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/Liella!团标.jpg' },
        
        { id: 51, name: '日野下花帆', type: 'member', series: '莲之空', group: 'Cerise Bouquet', grade: 2, birthdayMonth: 5, imageUrl: 'imgs/日野下花帆.jpg' },
        { id: 52, name: '村野沙耶香', type: 'member', series: '莲之空', group: 'DOLLCHESTRA', grade: 2, birthdayMonth: 1, imageUrl: 'imgs/村野沙耶香.jpg' },
        { id: 53, name: '大泽瑠璃乃', type: 'member', series: '莲之空', group: 'Mira-Cra Park!', grade: 2, birthdayMonth: 8, imageUrl: 'imgs/大泽瑠璃乃.jpg' },
        { id: 54, name: '百生吟子', type: 'member', series: '莲之空', group: 'Cerise Bouquet', grade: 1, birthdayMonth: 10, imageUrl: 'imgs/百生吟子.jpg' },
        { id: 55, name: '徒町小铃', type: 'member', series: '莲之空', group: 'DOLLCHESTRA', grade: 1, birthdayMonth: 2, imageUrl: 'imgs/徒町小铃.jpg' },
        { id: 56, name: '安养寺姬芽', type: 'member', series: '莲之空', group: 'Mira-Cra Park!', grade: 1, birthdayMonth: 9, imageUrl: 'imgs/安养寺姬芽.jpg' },
        { id: 57, name: '塞拉斯·柳田·利林费尔德', type: 'member', series: '莲之空', group: 'Edel Note', grade: 1, birthdayMonth: 6, imageUrl: 'imgs/塞拉斯·柳田·利林费尔德.jpg' },
        { id: 58, name: '桂城泉', type: 'member', series: '莲之空', group: 'Edel Note', grade: 2, birthdayMonth: 12, imageUrl: 'imgs/桂城泉.jpg' },
        { id: 59, name: '莲之空校徽', type: 'wildcard', series: '莲之空', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/莲之空校徽.jpg' },
        { id: 60, name: '莲之空团标', type: 'wildcard', series: '莲之空', group: '', grade: 0, birthdayMonth: 0, imageUrl: 'imgs/莲之空团标.jpg' },

        {id: 61, name: '高桥波尔卡', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 8,
        imageUrl: 'imgs/高桥波尔卡.jpg'},
        {id: 62, name: '麻布麻衣', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 2,
        imageUrl: 'imgs/麻布麻衣.jpg'},
        {id: 63, name: '五桐玲', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 7,
        imageUrl: 'imgs/五桐玲.jpg'},
        {id: 64, name: '驹形花火', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 6,
        imageUrl: 'imgs/驹形花火.jpg'},
        {id: 65, name: '金泽奇迹', type: 'member', series: '人生不易部!', group: '', grade: 2, birthdayMonth: 3,
        imageUrl: 'imgs/金泽奇迹.jpg'},
        {id: 66, name: '调布乃理子', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 4,
        imageUrl: 'imgs/调布乃理子.jpg'},
        {id: 67, name: '春宫悠可里', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 9,
        imageUrl: 'imgs/春宫悠可里.jpg'},
        {id: 68, name: '此花辉夜', type: 'member', series: '人生不易部!', group: '', grade: 2, birthdayMonth: 1,
        imageUrl: 'imgs/此花辉夜.jpg'},
        {id: 69, name: '山田真绿', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 5,
        imageUrl: 'imgs/山田真绿.jpg'},
        {id: 70, name: '佐佐木翔音', type: 'member', series: '人生不易部!', group: '', grade: 1, birthdayMonth: 11,
        imageUrl: 'imgs/佐佐木翔音.jpg'},
        {id: 71, name: '人生不易部校徽', type: 'wildcard', series: '人生不易部!', group: '', grade: 0, birthdayMonth: 0,
        imageUrl: 'imgs/人生不易部校徽.jpg'},
        {id: 72, name: '人生不易部团标', type: 'wildcard', series: '人生不易部!', group: '', grade: 0, birthdayMonth: 0,
        imageUrl: 'imgs/人生不易部团标.jpg'},

        {id: 73, name: '椿瑠璃香', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/椿瑠璃香.jpg'},
        {id: 74, name: '皇柚叶', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/皇柚叶.jpg'},
        {id: 75, name: '北条雪乃', type: 'member', series: '音乐剧', group: '', grade: 1, birthdayMonth: 0,
        imageUrl: 'imgs/北条雪乃.jpg'},
        {id: 76, name: '天草光', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/天草光.jpg'},
        {id: 77, name: '三笠真绫', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/三笠真绫.jpg'},
        {id: 78, name: '泷泽杏', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/泷泽杏.jpg'},
        {id: 79, name: '若槻美铃', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/若槻美铃.jpg'},
        {id: 80, name: '来栖乙爱', type: 'member', series: '音乐剧', group: '', grade: 1, birthdayMonth: 0,
        imageUrl: 'imgs/来栖乙爱.jpg'},
        {id: 81, name: '铃贺丽奈', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/铃贺丽奈.jpg'},
        {id: 82, name: '晴风小夜香', type: 'member', series: '音乐剧', group: '', grade: 2, birthdayMonth: 0,
        imageUrl: 'imgs/晴风小夜香.jpg'},
        {id: 83, name: '学园偶像音乐剧校徽', type: 'wildcard', series: '音乐剧', group: '', grade: 0,
        birthdayMonth: 0, imageUrl: 'imgs/学园偶像音乐剧校徽.jpg'},
        {id: 84, name: '学园偶像音乐剧团标', type: 'wildcard', series: '音乐剧', group: '', grade: 0,
        birthdayMonth: 0, imageUrl: 'imgs/学园偶像音乐剧团标.jpg'}
    ]
};

// 初始化游戏
function initGame() {
    clearAllTimers();
    game.state = GameState.IDLE;
    game.isMobile = window.innerWidth <= 768; // 检测是否是移动设备
    game.players = [
        { id: 0, name: '玩家', type: PlayerType.HUMAN, hand: [], score: 0 },
        { id: 1, name: '电玩女王叶月恋', type: PlayerType.AI, hand: [], score: 0 },
        { id: 2, name: '喊UNO的逢田姐', type: PlayerType.AI, hand: [], score: 0 },
        { id: 3, name: '鬼牌高手园田海未', type: PlayerType.AI, hand: [], score: 0 }
    ];
    game.currentPlayerIndex = 0;
    game.deck = [];
    game.discardedTiles = [];
    game.playerDiscardedTiles = [[], [], [], []]; // 重置每个玩家的弃牌堆
    game.isRiichi = [false, false, false, false]; // 重置立直状态
    game.riichiTileIndex = [-1, -1, -1, -1]; // 重置立直牌索引
    game.showRiichiButtons = false; // 重置立直按钮状态
    game.pendingNextPlayer = false; // 重置等待状态
    game.lastDrawnTile = [null, null, null, null]; // 重置刚摸到的牌
    game.playerChiTiles = [[], [], [], []]; // 重置吃牌区
    game.chiCount = [0, 0, 0, 0]; // 重置吃牌次数
    game.lastDiscardedTile = null; // 重置上一位玩家打出的牌（用于吃牌判断）
    game.lastDiscardingPlayerIndex = -1; // 重置上一位打出牌的玩家索引（用于吃牌判断）
    game.globalLastDiscardedTile = null; // 重置所有玩家中最后被打出的牌（用于显示红色边框）
    game.globalLastDiscardingPlayerIndex = -1; // 重置所有玩家中最后打出牌的玩家索引（用于显示红色边框）
    game.showChiButtons = false; // 重置吃牌按钮状态
    game.canChi = false; // 重置是否可以吃牌
    game.chiAvailableTiles = []; // 重置可以吃牌的手牌组合
    game.chiSelectedTiles = []; // 重置已选择的吃牌牌
    game.chiStep = 1; // 重置吃牌步骤
    game.showHuButtons = false; // 重置胡牌按钮状态
    game.pendingRonTile = null; // 重置待胡的荣和牌
    game.pendingRonPlayerIndex = -1; // 重置待胡的玩家索引
    game.selectedTile = null;
    
    // 生成牌组（每个成员1张，每个系列2张万能牌）
    game.cards.forEach(card => {
        game.deck.push({ ...card, uniqueId: `${card.id}_1` });
    });
    
    // 洗牌
    shuffleDeck();
    
    // 渲染游戏界面
    renderGame();
}

// 洗牌
function shuffleDeck() {
    for (let i = game.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [game.deck[i], game.deck[j]] = [game.deck[j], game.deck[i]];
    }
}

// 清除所有定时器
function clearAllTimers() {
    game.timers.forEach(timerId => {
        clearTimeout(timerId);
    });
    game.timers = [];
}

// 创建并管理定时器
function addTimer(callback, delay) {
    const timerId = setTimeout(() => {
        // 执行回调前检查游戏状态，只有在游戏进行中时才执行
        if (game.state === GameState.PLAYING) {
            callback();
        }
        // 从数组中移除已执行的定时器
        const index = game.timers.indexOf(timerId);
        if (index > -1) {
            game.timers.splice(index, 1);
        }
    }, delay);
    game.timers.push(timerId);
    return timerId;
}

// 分发牌
function dealTiles() {
    // 每个玩家发8张牌
    for (let i = 0; i < 8; i++) {
        game.players.forEach(player => {
            if (game.deck.length > 0) {
                player.hand.push(game.deck.pop());
            }
        });
    }
}

// 渲染游戏界面
function createDiscardedTilesElement(playerIndex) {
    const discardedTiles = document.createElement('div');
    discardedTiles.className = 'player-discarded-tiles';
    discardedTiles.style.display = 'flex';
    discardedTiles.style.flexWrap = 'wrap';
    discardedTiles.style.gap = '3px';
    discardedTiles.style.padding = '5px';
    discardedTiles.style.flex = '1';
    discardedTiles.style.overflow = 'auto';
    discardedTiles.style.alignContent = 'flex-start';
    
    game.playerDiscardedTiles[playerIndex].forEach((tile, tileIndex) => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile-small';
        tileElement.style.backgroundColor = getSeriesColor(tile.series);
        
        // 如果是立直时的最后一张牌，旋转90度
        if (game.isRiichi[playerIndex] && tileIndex === game.riichiTileIndex[playerIndex]) {
            tileElement.style.transform = 'rotate(90deg)';
            tileElement.style.margin = '10px';
        }
        
        // 如果是万能牌，添加特殊样式
        if (tile.type === 'wildcard') {
            tileElement.style.border = '2px dashed #FFD700';
        }
        
        // 如果是该玩家最后被打出的牌，添加金色边框（如果是万能牌，保留虚线边框但添加高亮）
        if (tileIndex === game.playerDiscardedTiles[playerIndex].length - 1) {
            if (tile.type !== 'wildcard') {
                tileElement.style.border = '3px solid #FFD700';
            }
            tileElement.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
        }
        
        // 如果是所有玩家中最后被打出的牌，添加较厚的红色边框
        if (game.globalLastDiscardedTile && 
            game.globalLastDiscardingPlayerIndex === playerIndex && 
            tile.uniqueId === game.globalLastDiscardedTile.uniqueId) {
            if (tile.type !== 'wildcard') {
                tileElement.style.border = '5px solid #F44336';
            } else {
                tileElement.style.border = '5px dashed #F44336';
            }
            tileElement.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.8)';
        }
        
        // 添加图片
        const img = document.createElement('img');
        img.src = tile.imageUrl;
        img.alt = tile.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        // 图片加载失败时显示文字
        img.onerror = function() {
            tileElement.removeChild(img);
            tileElement.textContent = tile.name;
            tileElement.style.display = 'flex';
            tileElement.style.justifyContent = 'center';
            tileElement.style.alignItems = 'center';
            tileElement.style.fontSize = '8px';
            tileElement.style.textAlign = 'center';
            tileElement.style.padding = '1px';
        };
        
        tileElement.appendChild(img);
        discardedTiles.appendChild(tileElement);
    });
    
    return discardedTiles;
}

// 渲染游戏界面
function renderGame() {
    const gameBoard = document.getElementById('game-board');
    game.isMobile = window.innerWidth <= 768; // 每次渲染时重新检测
    gameBoard.innerHTML = '';
    
    // 添加游戏信息到页面最上方
    const gameInfo = document.createElement('div');
    gameInfo.id = 'game-info';
    gameInfo.textContent = `当前回合: ${game.players[game.currentPlayerIndex].name}`;
    gameInfo.style.textAlign = 'center';
    gameInfo.style.fontSize = '20px';
    gameInfo.style.fontWeight = 'bold';
    gameInfo.style.padding = '10px';
    gameInfo.style.backgroundColor = '#f0f0f0';
    gameInfo.style.borderBottom = '2px solid #ddd';
    gameBoard.appendChild(gameInfo);
    
    // 创建玩家区域 - 移动端和桌面端不同布局
    let playerAreas;
    
    if (game.isMobile) {
        // 移动端：弃牌堆在中间，玩家在底部
        playerAreas = [
            { id: 'player-center', player: null },
            { id: 'player-south', player: game.players[0] }  // 玩家在底部
        ];
    } else {
        // 桌面端：顺时针顺序：玩家(南) → 机器人1(东) → 机器人2(北) → 机器人3(西)
        playerAreas = [
            { id: 'player-north', player: game.players[2] }, // 机器人2在北边（顶部）
            { id: 'player-west', player: game.players[3] },  // 机器人3在西边（左边，玩家的上家）
            { id: 'player-center', player: null },
            { id: 'player-east', player: game.players[1] },  // 机器人1在东边（右边）
            { id: 'player-south', player: game.players[0] }  // 玩家在南边（底部）
        ];
    }
    
    playerAreas.forEach(({ id, player }) => {
        const area = document.createElement('div');
        area.id = id;
        area.className = 'player-area';
        area.style.position = 'relative';
        
        if (player) {
            // 如果是当前玩家，添加金色边框
            if (player && player.id === game.currentPlayerIndex && player.type === PlayerType.AI) {
                area.style.border = '3px solid #FFD700';
                area.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            // 如果是机器人，显示头像
            if (player.type === PlayerType.AI) {
                const avatarImg = document.createElement('img');
                avatarImg.src = `imgs/机器人${player.id}.jpg`;
                avatarImg.alt = player.name;
                avatarImg.style.width = '40px';
                avatarImg.style.height = '40px';
                avatarImg.style.borderRadius = '50%';
                avatarImg.style.marginRight = '10px';
                avatarImg.style.verticalAlign = 'middle';
                avatarImg.style.objectFit = 'cover';
                area.appendChild(avatarImg);
            }
            
            const playerTitle = document.createElement('h3');
            playerTitle.style.display = 'inline';
            playerTitle.style.verticalAlign = 'middle';
            playerTitle.textContent = player.name;
            area.appendChild(playerTitle);
            
            // 如果玩家已立直，显示"已立直"
            if (game.isRiichi[player.id]) {
                const riichiLabel = document.createElement('span');
                riichiLabel.style.marginLeft = '10px';
                riichiLabel.style.padding = '2px 8px';
                riichiLabel.style.backgroundColor = '#FF5722';
                riichiLabel.style.color = 'white';
                riichiLabel.style.borderRadius = '4px';
                riichiLabel.style.fontSize = '12px';
                riichiLabel.textContent = '已立直';
                area.appendChild(riichiLabel);
            }
            
            // 对于AI玩家，显示吃牌区和牌的数量
            if (player.type === PlayerType.AI) {
                // 显示吃牌区（所有玩家都显示）
                if (game.playerChiTiles[player.id].length > 0) {
                    const chiArea = document.createElement('div');
                    chiArea.className = 'chi-area';
                    chiArea.style.position = 'absolute';
                    chiArea.style.padding = '10px';
                    chiArea.style.border = '2px dashed #4CAF50';
                    chiArea.style.borderRadius = '8px';
                    chiArea.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                    chiArea.style.zIndex = '10';
                    
                    // 根据玩家位置设置吃牌区位置
                    if (id === 'player-west' || id === 'player-east') {
                        // 机器人1和机器人3（左边和右边）：下调位置
                        chiArea.style.left = '50%';
                        chiArea.style.top = '60%';
                        chiArea.style.transform = 'translate(-50%, -50%)';
                    } else {
                        // 机器人2（顶部）：保持原位置
                        chiArea.style.left = '10px';
                        chiArea.style.top = '10px';
                    }
                    
                    const chiTitle = document.createElement('h4');
                    chiTitle.textContent = '吃牌区';
                    chiTitle.style.margin = '0 0 10px 0';
                    chiTitle.style.fontSize = '14px';
                    chiTitle.style.color = '#4CAF50';
                    chiArea.appendChild(chiTitle);
                    
                    const chiTilesContainer = document.createElement('div');
                    chiTilesContainer.style.display = 'flex';
                    chiTilesContainer.style.flexDirection = 'column';
                    chiTilesContainer.style.gap = '10px';
                    
                    game.playerChiTiles[player.id].forEach((chiGroup, groupIndex) => {
                        const groupDiv = document.createElement('div');
                        groupDiv.style.display = 'flex';
                        groupDiv.style.gap = '5px';
                        groupDiv.style.padding = '5px';
                        groupDiv.style.border = '1px solid #4CAF50';
                        groupDiv.style.borderRadius = '4px';
                        groupDiv.style.backgroundColor = 'white';
                        
                        chiGroup.forEach(tile => {
                            const tileWrapper = document.createElement('div');
                            tileWrapper.className = 'tile-wrapper';
                            
                            const tileElement = document.createElement('div');
                            tileElement.className = 'tile-small';
                            tileElement.style.backgroundColor = getSeriesColor(tile.series);
                            
                            if (tile.type === 'wildcard') {
                                tileElement.style.border = '2px dashed #FFD700';
                            }
                            
                            const img = document.createElement('img');
                            img.src = tile.imageUrl;
                            img.alt = tile.name;
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'cover';
                            
                            img.onerror = function() {
                                tileElement.removeChild(img);
                                tileElement.textContent = tile.name;
                                tileElement.style.display = 'flex';
                                tileElement.style.justifyContent = 'center';
                                tileElement.style.alignItems = 'center';
                                tileElement.style.fontSize = '8px';
                                tileElement.style.textAlign = 'center';
                                tileElement.style.padding = '1px';
                            };
                            
                            tileElement.appendChild(img);
                            tileWrapper.appendChild(tileElement);
                            
                            // 如果需要显示角色信息
                            if (game.showCharacterInfo) {
                                const infoDiv = document.createElement('div');
                                infoDiv.className = 'character-info';
                                infoDiv.style.fontSize = '10px';
                                infoDiv.innerHTML = `
                                    <div><strong>系列:</strong> ${tile.series}</div>
                                    <div><strong>小组:</strong> ${tile.group || '无'}</div>
                                    <div><strong>学年:</strong> ${tile.grade || '无'}</div>
                                    <div><strong>生日:</strong> ${tile.birthdayMonth ? tile.birthdayMonth + '月' : '无'}</div>
                                `;
                                tileWrapper.appendChild(infoDiv);
                            }
                            
                            groupDiv.appendChild(tileWrapper);
                        });
                        
                        chiTilesContainer.appendChild(groupDiv);
                    });
                    
                    chiArea.appendChild(chiTilesContainer);
                    area.appendChild(chiArea);
                }
                
                const hand = document.createElement('div');
                hand.className = 'hand';
                hand.innerHTML = `<div style="font-size: 18px;">${player.hand.length} 张牌</div>`;
                hand.style.display = 'flex';
                hand.style.justifyContent = 'center';
                hand.style.alignItems = 'center';
                area.appendChild(hand);
            } else {
                // 添加控制按钮区域
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'player-controls';
            controlsDiv.style.marginBottom = '10px';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.gap = game.isMobile ? '4px' : '10px';
            controlsDiv.style.justifyContent = 'center';
            controlsDiv.style.flexWrap = 'wrap';
            
            // 开始游戏按钮
            const startButton = document.createElement('button');
            startButton.id = 'start-game';
            startButton.textContent = game.isMobile ? '开始' : '开始游戏';
            startButton.style.fontSize = game.isMobile ? '10px' : '16px';
            startButton.style.padding = game.isMobile ? '4px 6px' : '8px 20px';
            startButton.style.minWidth = game.isMobile ? '50px' : 'auto';
            startButton.disabled = game.state !== GameState.IDLE;
            startButton.addEventListener('click', startGame);
            controlsDiv.appendChild(startButton);
            
            // 重新开始按钮
            const restartButton = document.createElement('button');
            restartButton.id = 'restart-game';
            restartButton.textContent = game.isMobile ? '重开' : '重新开始';
            restartButton.style.fontSize = game.isMobile ? '10px' : '16px';
            restartButton.style.padding = game.isMobile ? '4px 6px' : '8px 20px';
            restartButton.style.minWidth = game.isMobile ? '50px' : 'auto';
            restartButton.addEventListener('click', startGame);
            controlsDiv.appendChild(restartButton);
            
            // 显示/隐藏角色信息按钮
            const toggleInfoButton = document.createElement('button');
            toggleInfoButton.id = 'toggle-info-btn';
            toggleInfoButton.textContent = game.showCharacterInfo ? (game.isMobile ? '隐信息' : '隐藏信息') : (game.isMobile ? '显信息' : '显示信息');
            toggleInfoButton.style.fontSize = game.isMobile ? '10px' : '16px';
            toggleInfoButton.style.padding = game.isMobile ? '4px 6px' : '8px 20px';
            toggleInfoButton.style.minWidth = game.isMobile ? '50px' : 'auto';
            toggleInfoButton.addEventListener('click', () => {
                game.showCharacterInfo = !game.showCharacterInfo;
                renderGame();
            });
            controlsDiv.appendChild(toggleInfoButton);
            
            // 排序按钮
            const sortButton = document.createElement('button');
            sortButton.id = 'sort-tiles-btn';
            sortButton.textContent = '排序';
            sortButton.style.fontSize = game.isMobile ? '10px' : '16px';
            sortButton.style.padding = game.isMobile ? '4px 6px' : '8px 20px';
            sortButton.style.minWidth = game.isMobile ? '40px' : 'auto';
                sortButton.addEventListener('click', () => {
                    const lastDrawn = game.lastDrawnTile[0];
                    let lastDrawnTile = null;
                    
                    if (lastDrawn) {
                        // 找到刚摸到的牌并移除
                        const lastDrawnIndex = player.hand.findIndex(tile => tile.uniqueId === lastDrawn.uniqueId);
                        if (lastDrawnIndex !== -1) {
                            lastDrawnTile = player.hand.splice(lastDrawnIndex, 1)[0];
                        }
                    }
                    
                    // 对剩余的牌进行排序
                    player.hand = sortTilesBySeries(player.hand);
                    
                    // 如果有刚摸到的牌，将它添加到手牌末尾
                    if (lastDrawnTile) {
                        player.hand.push(lastDrawnTile);
                    }
                    
                    renderGame();
                });
                controlsDiv.appendChild(sortButton);
                
                // 打出牌按钮（仅在游戏进行中且是人类玩家回合时显示，且不显示胡牌按钮时）
                if (game.state === GameState.PLAYING && game.currentPlayerIndex === 0 && !game.showHuButtons) {
                    const discardButton = document.createElement('button');
                    discardButton.id = 'discard-tile';
                    discardButton.textContent = '打出牌';
                    discardButton.style.fontSize = '16px';
                    discardButton.style.padding = '8px 20px';
                    discardButton.disabled = game.selectedTile === null;
                    discardButton.addEventListener('click', discardTile);
                    controlsDiv.appendChild(discardButton);
                }
                
                area.appendChild(controlsDiv);
                
                // 吃牌按钮（不显示胡牌按钮时）
                if (game.showChiButtons && !game.showHuButtons) {
                    const chiButtonsDiv = document.createElement('div');
                    chiButtonsDiv.className = 'chi-buttons';
                    chiButtonsDiv.style.marginTop = '10px';
                    chiButtonsDiv.style.display = 'flex';
                    chiButtonsDiv.style.gap = '10px';
                    chiButtonsDiv.style.justifyContent = 'center';
                    
                    if (game.chiStep === 1) {
                        // 步骤1：选择吃/不吃
                        const declareChiBtn = document.createElement('button');
                        declareChiBtn.id = 'declare-chi-btn';
                        declareChiBtn.textContent = '吃';
                        declareChiBtn.style.backgroundColor = '#4CAF50';
                        declareChiBtn.style.fontSize = '16px';
                        declareChiBtn.style.padding = '8px 20px';
                        declareChiBtn.addEventListener('click', startSelectChiTiles);
                        chiButtonsDiv.appendChild(declareChiBtn);
                        
                        const skipChiBtn = document.createElement('button');
                        skipChiBtn.id = 'skip-chi-btn';
                        skipChiBtn.textContent = '取消';
                        skipChiBtn.style.fontSize = '16px';
                        skipChiBtn.style.padding = '8px 20px';
                        skipChiBtn.addEventListener('click', skipChi);
                        chiButtonsDiv.appendChild(skipChiBtn);
                    } else if (game.chiStep === 2) {
                        // 步骤2：选择牌
                        const hint = document.createElement('div');
                        hint.textContent = `请选择2张${game.lastDiscardedTile.series}系列的牌进行吃牌（已选${game.chiSelectedTiles.length}/2）`;
                        hint.style.width = '100%';
                        hint.style.textAlign = 'center';
                        hint.style.marginBottom = '10px';
                        hint.style.color = '#4CAF50';
                        hint.style.fontWeight = 'bold';
                        area.appendChild(hint);
                        
                        const confirmBtn = document.createElement('button');
                        confirmBtn.id = 'confirm-chi-btn';
                        confirmBtn.textContent = '确认吃牌';
                        confirmBtn.style.backgroundColor = '#2196F3';
                        confirmBtn.style.fontSize = '16px';
                        confirmBtn.style.padding = '8px 20px';
                        confirmBtn.disabled = game.chiSelectedTiles.length !== 2;
                        confirmBtn.addEventListener('click', confirmChi);
                        chiButtonsDiv.appendChild(confirmBtn);
                        
                        const cancelBtn = document.createElement('button');
                        cancelBtn.id = 'cancel-chi-btn';
                        cancelBtn.textContent = '取消';
                        cancelBtn.style.fontSize = '16px';
                        cancelBtn.style.padding = '8px 20px';
                        cancelBtn.addEventListener('click', cancelSelectChiTiles);
                        chiButtonsDiv.appendChild(cancelBtn);
                    }
                    
                    area.appendChild(chiButtonsDiv);
                }
                
                // 立直宣告按钮（不显示胡牌按钮时）
                if (game.showRiichiButtons && !game.showHuButtons) {
                    const riichiButtonsDiv = document.createElement('div');
                    riichiButtonsDiv.className = 'riichi-buttons';
                    riichiButtonsDiv.style.marginTop = '10px';
                    riichiButtonsDiv.style.display = 'flex';
                    riichiButtonsDiv.style.gap = '10px';
                    riichiButtonsDiv.style.justifyContent = 'center';
                    
                    const declareRiichiBtn = document.createElement('button');
                    declareRiichiBtn.id = 'declare-riichi-btn';
                    declareRiichiBtn.textContent = '立直';
                    declareRiichiBtn.style.backgroundColor = '#FF5722';
                    declareRiichiBtn.style.fontSize = '16px';
                    declareRiichiBtn.style.padding = '8px 20px';
                    declareRiichiBtn.addEventListener('click', declareRiichi);
                    riichiButtonsDiv.appendChild(declareRiichiBtn);
                    
                    const skipRiichiBtn = document.createElement('button');
                    skipRiichiBtn.id = 'skip-riichi-btn';
                    skipRiichiBtn.textContent = '取消';
                    skipRiichiBtn.style.fontSize = '16px';
                    skipRiichiBtn.style.padding = '8px 20px';
                    skipRiichiBtn.addEventListener('click', skipRiichi);
                    riichiButtonsDiv.appendChild(skipRiichiBtn);
                    
                    area.appendChild(riichiButtonsDiv);
                }
                
                // 胡牌按钮（只在人类玩家区域显示）
                if (game.showHuButtons && player.type === PlayerType.HUMAN) {
                    const huButtonsDiv = document.createElement('div');
                    huButtonsDiv.className = 'hu-buttons';
                    huButtonsDiv.style.marginTop = '10px';
                    huButtonsDiv.style.display = 'flex';
                    huButtonsDiv.style.gap = '10px';
                    huButtonsDiv.style.justifyContent = 'center';
                    
                    const declareHuBtn = document.createElement('button');
                    declareHuBtn.id = 'declare-hu-btn';
                    declareHuBtn.textContent = '胡';
                    declareHuBtn.style.backgroundColor = '#E91E63';
                    declareHuBtn.style.color = 'white';
                    declareHuBtn.style.fontSize = '16px';
                    declareHuBtn.style.padding = '8px 20px';
                    declareHuBtn.addEventListener('click', declareHu);
                    huButtonsDiv.appendChild(declareHuBtn);
                    
                    const skipHuBtn = document.createElement('button');
                    skipHuBtn.id = 'skip-hu-btn';
                    skipHuBtn.textContent = '取消';
                    skipHuBtn.style.fontSize = '16px';
                    skipHuBtn.style.padding = '8px 20px';
                    skipHuBtn.addEventListener('click', skipHu);
                    huButtonsDiv.appendChild(skipHuBtn);
                    
                    area.appendChild(huButtonsDiv);
                }
                
                // 显示吃牌区（所有玩家都显示）- 在最左侧
                // 手机模式下不显示这个绝对定位的吃牌区，而是在手牌下方显示
                if (!game.isMobile && game.playerChiTiles[player.id].length > 0) {
                    const chiArea = document.createElement('div');
                    chiArea.className = 'chi-area';
                    chiArea.style.position = 'absolute';
                    chiArea.style.left = '10px';
                    chiArea.style.top = '10px';
                    chiArea.style.padding = '10px';
                    chiArea.style.border = '2px dashed #4CAF50';
                    chiArea.style.borderRadius = '8px';
                    chiArea.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                    chiArea.style.zIndex = '10';
                    
                    const chiTitle = document.createElement('h4');
                    chiTitle.textContent = '吃牌区';
                    chiTitle.style.margin = '0 0 10px 0';
                    chiTitle.style.fontSize = '14px';
                    chiTitle.style.color = '#4CAF50';
                    chiArea.appendChild(chiTitle);
                    
                    const chiTilesContainer = document.createElement('div');
                    chiTilesContainer.style.display = 'flex';
                    chiTilesContainer.style.flexDirection = 'column';
                    chiTilesContainer.style.gap = '10px';
                    
                    game.playerChiTiles[player.id].forEach((chiGroup, groupIndex) => {
                        const groupDiv = document.createElement('div');
                        groupDiv.style.display = 'flex';
                        groupDiv.style.gap = '5px';
                        groupDiv.style.padding = '5px';
                        groupDiv.style.border = '1px solid #4CAF50';
                        groupDiv.style.borderRadius = '4px';
                        groupDiv.style.backgroundColor = 'white';
                        
                        chiGroup.forEach(tile => {
                            const tileWrapper = document.createElement('div');
                            tileWrapper.className = 'tile-wrapper';
                            
                            const tileElement = document.createElement('div');
                            tileElement.className = 'tile-small';
                            tileElement.style.backgroundColor = getSeriesColor(tile.series);
                            
                            if (tile.type === 'wildcard') {
                                tileElement.style.border = '2px dashed #FFD700';
                            }
                            
                            const img = document.createElement('img');
                            img.src = tile.imageUrl;
                            img.alt = tile.name;
                            img.style.width = '100%';
                            img.style.height = '100%';
                            img.style.objectFit = 'cover';
                            
                            img.onerror = function() {
                                tileElement.removeChild(img);
                                tileElement.textContent = tile.name;
                                tileElement.style.display = 'flex';
                                tileElement.style.justifyContent = 'center';
                                tileElement.style.alignItems = 'center';
                                tileElement.style.fontSize = '8px';
                                tileElement.style.textAlign = 'center';
                                tileElement.style.padding = '1px';
                            };
                            
                            tileElement.appendChild(img);
                            tileWrapper.appendChild(tileElement);
                            
                            // 如果需要显示角色信息
                            if (game.showCharacterInfo) {
                                const infoDiv = document.createElement('div');
                                infoDiv.className = 'character-info';
                                infoDiv.style.fontSize = '10px';
                                infoDiv.innerHTML = `
                                    <div><strong>系列:</strong> ${tile.series}</div>
                                    <div><strong>小组:</strong> ${tile.group || '无'}</div>
                                    <div><strong>学年:</strong> ${tile.grade || '无'}</div>
                                    <div><strong>生日:</strong> ${tile.birthdayMonth ? tile.birthdayMonth + '月' : '无'}</div>
                                `;
                                tileWrapper.appendChild(infoDiv);
                            }
                            
                            groupDiv.appendChild(tileWrapper);
                        });
                        
                        chiTilesContainer.appendChild(groupDiv);
                    });
                    
                    chiArea.appendChild(chiTilesContainer);
                    area.appendChild(chiArea);
                }
                
                const hand = document.createElement('div');
                hand.className = 'hand';
                hand.style.display = 'flex';
                hand.style.justifyContent = 'center';
                hand.style.alignItems = 'center';
                area.appendChild(hand);
                
                // 显示具体的牌
                let draggedTile = null;
                let draggedIndex = -1;
                const lastDrawn = game.lastDrawnTile[0];
                
                player.hand.forEach((tile, index) => {
                    const tileWrapper = document.createElement('div');
                    tileWrapper.className = 'tile-wrapper';
                    
                    const tileElement = document.createElement('div');
                    tileElement.className = 'tile';
                    tileElement.dataset.uniqueId = tile.uniqueId;
                    tileElement.dataset.index = index;
                    
                    // 立直后或胡牌选择模式下不能拖动手牌
                    tileElement.draggable = !game.isRiichi[0] && !game.showHuButtons;
                    tileElement.style.backgroundColor = getSeriesColor(tile.series);
                    
                    // 如果是万能牌，添加特殊样式
                    if (tile.type === 'wildcard') {
                        tileElement.style.border = '2px dashed #FFD700';
                    }
                    
                    // 如果是刚摸到的牌，添加特殊样式
                    if (lastDrawn && tile.uniqueId === lastDrawn.uniqueId) {
                        tileElement.classList.add('last-drawn-tile');
                        tileElement.style.border = '3px solid #FFD700';
                        tileElement.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
                        tileElement.style.zIndex = '10';
                        // 将移动效果应用到 wrapper 上，让角色信息也跟着移动
                        tileWrapper.style.transform = 'translateX(40px)';
                        tileWrapper.style.zIndex = '10';
                    }
                    
                    // 如果已立直且不是刚摸到的牌，添加禁用样式
                    if (game.isRiichi[0] && (!lastDrawn || tile.uniqueId !== lastDrawn.uniqueId)) {
                        tileElement.classList.add('disabled-tile');
                        tileElement.style.cursor = 'not-allowed';
                        tileElement.style.opacity = '0.5';
                    }
                    
                    // 吃牌选择模式
                    if (game.chiStep === 2) {
                        const isAvailable = game.chiAvailableTiles.some(t => t.uniqueId === tile.uniqueId);
                        const isSelected = game.chiSelectedTiles.some(t => t.uniqueId === tile.uniqueId);
                        
                        if (!isAvailable) {
                            // 不是可用牌，禁用
                            tileElement.classList.add('disabled-tile');
                            tileElement.style.cursor = 'not-allowed';
                            tileElement.style.opacity = '0.3';
                        }
                        
                        if (isSelected) {
                            // 已选中的牌
                            tileElement.classList.add('selected');
                            tileElement.style.border = '3px solid #2196F3';
                            tileElement.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.5)';
                        }
                    }
                    
                    // 胡牌选择模式，禁用手牌选择
                    if (game.showHuButtons) {
                        tileElement.classList.add('disabled-tile');
                        tileElement.style.cursor = 'not-allowed';
                        tileElement.style.opacity = '0.5';
                    }
                    
                    // 添加图片
                    const img = document.createElement('img');
                    img.src = tile.imageUrl;
                    img.alt = tile.name;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    
                    // 图片加载失败时显示文字
                    img.onerror = function() {
                        tileElement.removeChild(img);
                        tileElement.textContent = tile.name;
                        tileElement.style.display = 'flex';
                        tileElement.style.justifyContent = 'center';
                        tileElement.style.alignItems = 'center';
                        tileElement.style.fontSize = '12px';
                        tileElement.style.textAlign = 'center';
                        tileElement.style.padding = '2px';
                    };
                    
                    tileElement.appendChild(img);
                    
                    // 添加点击事件
                    tileElement.addEventListener('click', () => {
                        if (game.showHuButtons) {
                            // 胡牌选择模式，不允许选择手牌
                            return;
                        }
                        if (game.chiStep === 2) {
                            // 吃牌选择模式
                            toggleChiTileSelection(tile);
                        } else {
                            // 正常选择牌模式
                            selectTile(tile);
                        }
                    });
                    
                    // 拖拽开始
                    tileElement.addEventListener('dragstart', (e) => {
                        draggedTile = tile;
                        draggedIndex = index;
                        tileElement.classList.add('dragging');
                        e.dataTransfer.setData('text/plain', tile.uniqueId);
                    });
                    
                    // 拖拽结束
                    tileElement.addEventListener('dragend', () => {
                        tileElement.classList.remove('dragging');
                        document.querySelectorAll('.drag-over').forEach(el => {
                            el.classList.remove('drag-over');
                        });
                        draggedTile = null;
                        draggedIndex = -1;
                    });
                    
                    // 拖拽进入
                    tileElement.addEventListener('dragenter', (e) => {
                        e.preventDefault();
                        if (e.currentTarget !== tileElement) {
                            e.currentTarget.classList.add('drag-over');
                        }
                    });
                    
                    // 拖拽离开
                    tileElement.addEventListener('dragleave', (e) => {
                        e.currentTarget.classList.remove('drag-over');
                    });
                    
                    // 拖拽中
                    tileElement.addEventListener('dragover', (e) => {
                        e.preventDefault();
                    });
                    
                    // 放置
                    tileElement.addEventListener('drop', (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('drag-over');
                        
                        if (draggedTile && draggedIndex !== index) {
                            // 交换手牌顺序
                            const currentPlayer = game.players[game.currentPlayerIndex];
                            const temp = currentPlayer.hand[draggedIndex];
                            currentPlayer.hand[draggedIndex] = currentPlayer.hand[index];
                            currentPlayer.hand[index] = temp;
                            
                            // 重新渲染手牌
                            renderGame();
                        }
                    });
                    
                    tileWrapper.appendChild(tileElement);
                    
                    // 如果需要显示角色信息
                    if (game.showCharacterInfo) {
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'character-info';
                        infoDiv.innerHTML = `
                            <div><strong>系列:</strong> ${tile.series}</div>
                            <div><strong>小组:</strong> ${tile.group || '无'}</div>
                            <div><strong>学年:</strong> ${tile.grade || '无'}</div>
                            <div><strong>生日:</strong> ${tile.birthdayMonth ? tile.birthdayMonth + '月' : '无'}</div>
                        `;
                        tileWrapper.appendChild(infoDiv);
                    }
                    
                    hand.appendChild(tileWrapper);
                });
            }
            
            // 显示玩家的吃牌区（在手机端放在手牌下方）
            if (game.isMobile && game.playerChiTiles[player.id].length > 0) {
                const chiArea = document.createElement('div');
                chiArea.style.marginTop = '10px';
                chiArea.style.padding = '8px';
                chiArea.style.border = '2px dashed #4CAF50';
                chiArea.style.borderRadius = '6px';
                chiArea.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                chiArea.style.clear = 'both';
                
                const chiTitle = document.createElement('h4');
                chiTitle.textContent = '吃牌区';
                chiTitle.style.margin = '0 0 8px 0';
                chiTitle.style.fontSize = '12px';
                chiTitle.style.color = '#4CAF50';
                chiArea.appendChild(chiTitle);
                
                const chiTilesContainer = document.createElement('div');
                chiTilesContainer.style.display = 'flex';
                chiTilesContainer.style.flexDirection = 'column';
                chiTilesContainer.style.gap = '8px';
                
                game.playerChiTiles[player.id].forEach((chiGroup) => {
                    const groupDiv = document.createElement('div');
                    groupDiv.style.display = 'flex';
                    groupDiv.style.gap = '5px';
                    groupDiv.style.padding = '5px';
                    groupDiv.style.border = '1px solid #4CAF50';
                    groupDiv.style.borderRadius = '4px';
                    groupDiv.style.backgroundColor = 'white';
                    
                    chiGroup.forEach(tile => {
                        const tileWrapper = document.createElement('div');
                        tileWrapper.className = 'tile-wrapper';
                        
                        const tileElement = document.createElement('div');
                        tileElement.className = 'tile-small';
                        tileElement.style.backgroundColor = getSeriesColor(tile.series);
                        
                        if (tile.type === 'wildcard') {
                            tileElement.style.border = '2px dashed #FFD700';
                        }
                        
                        const img = document.createElement('img');
                        img.src = tile.imageUrl;
                        img.alt = tile.name;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        
                        img.onerror = function() {
                            tileElement.removeChild(img);
                            tileElement.textContent = tile.name;
                            tileElement.style.display = 'flex';
                            tileElement.style.justifyContent = 'center';
                            tileElement.style.alignItems = 'center';
                            tileElement.style.fontSize = '8px';
                            tileElement.style.textAlign = 'center';
                            tileElement.style.padding = '1px';
                        };
                        
                        tileElement.appendChild(img);
                        tileWrapper.appendChild(tileElement);
                        
                        // 如果需要显示角色信息
                        if (game.showCharacterInfo) {
                            const infoDiv = document.createElement('div');
                            infoDiv.className = 'character-info';
                            infoDiv.style.fontSize = '10px';
                            infoDiv.innerHTML = `
                                <div><strong>系列:</strong> ${tile.series}</div>
                                <div><strong>小组:</strong> ${tile.group || '无'}</div>
                                <div><strong>学年:</strong> ${tile.grade || '无'}</div>
                                <div><strong>生日:</strong> ${tile.birthdayMonth ? tile.birthdayMonth + '月' : '无'}</div>
                            `;
                            tileWrapper.appendChild(infoDiv);
                        }
                        
                        groupDiv.appendChild(tileWrapper);
                    });
                    
                    chiTilesContainer.appendChild(groupDiv);
                });
                
                chiArea.appendChild(chiTilesContainer);
                area.appendChild(chiArea);
            }
        } else {
            // 中心区域显示弃牌堆 - 移动端和桌面端不同布局
            if (game.isMobile) {
                // 移动端：上方3/4显示3个机器人弃牌区（水平排列），下方1/4显示玩家弃牌
                const discardLayout = document.createElement('div');
                discardLayout.style.display = 'flex';
                discardLayout.style.flexDirection = 'column';
                discardLayout.style.width = '100%';
                discardLayout.style.height = '100%';
                discardLayout.style.gap = '5px';
                discardLayout.style.minHeight = '0';
                discardLayout.style.overflow = 'hidden';
                
                // 上方3/4：3个机器人弃牌区水平排列
                const aiDiscardArea = document.createElement('div');
                aiDiscardArea.style.flex = '3';
                aiDiscardArea.style.display = 'flex';
                aiDiscardArea.style.gap = '5px';
                aiDiscardArea.style.minHeight = '0';
                aiDiscardArea.style.overflow = 'hidden';
                
                // 机器人3、机器人2、机器人1，从左到右
                const aiPlayers = [game.players[3], game.players[2], game.players[1]];
                
                aiPlayers.forEach(aiPlayer => {
                    const aiArea = document.createElement('div');
                    aiArea.style.flex = '1';
                    aiArea.style.display = 'flex';
                    aiArea.style.flexDirection = 'column';
                    aiArea.style.border = '1px solid #cccccc';
                    aiArea.style.borderRadius = '8px';
                    aiArea.style.padding = '4px';
                    aiArea.style.backgroundColor = '#f9f9f9';
                    aiArea.style.overflow = 'hidden';
                    aiArea.style.minHeight = '0';
                    
                    // 如果是当前玩家，添加金色边框
                    if (aiPlayer.id === game.currentPlayerIndex) {
                        aiArea.style.border = '2px solid #FFD700';
                        aiArea.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.5)';
                    }
                    
                    // 显示机器人信息区域
                    const infoArea = document.createElement('div');
                    infoArea.style.display = 'flex';
                    infoArea.style.alignItems = 'center';
                    infoArea.style.gap = '4px';
                    infoArea.style.marginBottom = '4px';
                    infoArea.style.flexShrink = '0';
                    
                    // 头像
                    const avatarImg = document.createElement('img');
                    avatarImg.src = `imgs/机器人${aiPlayer.id}.jpg`;
                    avatarImg.alt = aiPlayer.name;
                    avatarImg.style.width = '24px';
                    avatarImg.style.height = '24px';
                    avatarImg.style.borderRadius = '50%';
                    avatarImg.style.objectFit = 'cover';
                    infoArea.appendChild(avatarImg);
                    
                    // 名字和信息
                    const nameInfoArea = document.createElement('div');
                    nameInfoArea.style.display = 'flex';
                    nameInfoArea.style.flexDirection = 'column';
                    
                    const nameDiv = document.createElement('div');
                    nameDiv.style.fontSize = '9px';
                    nameDiv.style.fontWeight = 'bold';
                    nameDiv.style.wordBreak = 'break-all';
                    nameDiv.textContent = aiPlayer.name;
                    nameInfoArea.appendChild(nameDiv);
                    
                    const countDiv = document.createElement('div');
                    countDiv.style.fontSize = '8px';
                    countDiv.style.color = '#666';
                    let infoText = `${aiPlayer.hand.length}张`;
                    if (game.isRiichi[aiPlayer.id]) {
                        infoText += ' 立直';
                    }
                    if (game.chiCount[aiPlayer.id] > 0) {
                        infoText += ` 吃${game.chiCount[aiPlayer.id]}`;
                    }
                    countDiv.textContent = infoText;
                    nameInfoArea.appendChild(countDiv);
                    
                    infoArea.appendChild(nameInfoArea);
                    aiArea.appendChild(infoArea);
                    
                    // 显示弃牌
                    const discardContainer = document.createElement('div');
                    discardContainer.style.flex = '1';
                    discardContainer.style.overflow = 'hidden';
                    discardContainer.style.display = 'flex';
                    discardContainer.style.flexWrap = 'wrap';
                    discardContainer.style.justifyContent = 'center';
                    discardContainer.style.alignContent = 'flex-start';
                    discardContainer.style.gap = '3px';
                    discardContainer.style.minHeight = '0';
                    
                    const aiDiscards = game.playerDiscardedTiles[aiPlayer.id];
                    aiDiscards.forEach((tile) => {
                        const tileElement = document.createElement('div');
                        tileElement.className = 'tile-small';
                        tileElement.style.backgroundColor = getSeriesColor(tile.series);
                        tileElement.style.width = '24px';
                        tileElement.style.height = '32px';
                        
                        if (tile.type === 'wildcard') {
                            tileElement.style.border = '2px dashed #FFD700';
                        }
                        
                        if (game.globalLastDiscardingPlayerIndex === aiPlayer.id && 
                            game.globalLastDiscardedTile && 
                            game.globalLastDiscardedTile.uniqueId === tile.uniqueId) {
                            tileElement.classList.add('last-discarded-tile');
                        }
                        
                        const img = document.createElement('img');
                        img.src = tile.imageUrl;
                        img.alt = tile.name;
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        
                        img.onerror = function() {
                            tileElement.removeChild(img);
                            tileElement.textContent = tile.name;
                            tileElement.style.display = 'flex';
                            tileElement.style.justifyContent = 'center';
                            tileElement.style.alignItems = 'center';
                            tileElement.style.fontSize = '7px';
                        };
                        
                        tileElement.appendChild(img);
                        discardContainer.appendChild(tileElement);
                    });
                    
                    aiArea.appendChild(discardContainer);
                    
                    // 显示吃牌区
                    if (game.playerChiTiles[aiPlayer.id].length > 0) {
                        const chiArea = document.createElement('div');
                        chiArea.style.marginTop = '4px';
                        chiArea.style.padding = '4px';
                        chiArea.style.border = '1px dashed #4CAF50';
                        chiArea.style.borderRadius = '4px';
                        chiArea.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                        chiArea.style.maxHeight = '80px';
                        chiArea.style.overflowY = 'auto';
                        chiArea.style.flexShrink = '0';
                        
                        const chiTitle = document.createElement('div');
                        chiTitle.style.fontSize = '8px';
                        chiTitle.style.color = '#4CAF50';
                        chiTitle.style.marginBottom = '3px';
                        chiTitle.textContent = '吃牌区';
                        chiArea.appendChild(chiTitle);
                        
                        const chiTilesContainer = document.createElement('div');
                        chiTilesContainer.style.display = 'flex';
                        chiTilesContainer.style.flexWrap = 'wrap';
                        chiTilesContainer.style.gap = '3px';
                        
                        game.playerChiTiles[aiPlayer.id].forEach((chiGroup) => {
                            const groupDiv = document.createElement('div');
                            groupDiv.style.display = 'flex';
                            groupDiv.style.gap = '2px';
                            groupDiv.style.padding = '2px';
                            groupDiv.style.border = '1px solid #4CAF50';
                            groupDiv.style.borderRadius = '3px';
                            groupDiv.style.backgroundColor = 'white';
                            
                            chiGroup.forEach(tile => {
                                const tileElement = document.createElement('div');
                                tileElement.className = 'tile-small';
                                tileElement.style.width = '20px';
                                tileElement.style.height = '27px';
                                tileElement.style.backgroundColor = getSeriesColor(tile.series);
                                
                                if (tile.type === 'wildcard') {
                                    tileElement.style.border = '2px dashed #FFD700';
                                }
                                
                                const img = document.createElement('img');
                                img.src = tile.imageUrl;
                                img.alt = tile.name;
                                img.style.width = '100%';
                                img.style.height = '100%';
                                img.style.objectFit = 'cover';
                                
                                img.onerror = function() {
                                    tileElement.removeChild(img);
                                    tileElement.textContent = tile.name;
                                    tileElement.style.display = 'flex';
                                    tileElement.style.justifyContent = 'center';
                                    tileElement.style.alignItems = 'center';
                                    tileElement.style.fontSize = '6px';
                                };
                                
                                tileElement.appendChild(img);
                                groupDiv.appendChild(tileElement);
                            });
                            
                            chiTilesContainer.appendChild(groupDiv);
                        });
                        
                        chiArea.appendChild(chiTilesContainer);
                        aiArea.appendChild(chiArea);
                    }
                    
                    aiDiscardArea.appendChild(aiArea);
                });
                
                // 下方1/4：玩家弃牌
                const playerDiscardArea = document.createElement('div');
                playerDiscardArea.style.flex = '1';
                playerDiscardArea.style.display = 'flex';
                playerDiscardArea.style.flexDirection = 'column';
                playerDiscardArea.style.border = '1px solid #cccccc';
                playerDiscardArea.style.borderRadius = '8px';
                playerDiscardArea.style.padding = '4px';
                playerDiscardArea.style.overflow = 'hidden';
                playerDiscardArea.style.minHeight = '0';
                
                if (game.currentPlayerIndex === 0) {
                    playerDiscardArea.style.border = '2px solid #FFD700';
                    playerDiscardArea.style.boxShadow = '0 0 8px rgba(255, 215, 0, 0.5)';
                }
                
                const playerDiscardedTiles = createDiscardedTilesElement(0);
                playerDiscardArea.appendChild(playerDiscardedTiles);
                
                discardLayout.appendChild(aiDiscardArea);
                discardLayout.appendChild(playerDiscardArea);
                area.appendChild(discardLayout);
            } else {
                // 桌面端：左1/4 - 机器人3，中间1/2 - 机器人2，右1/4 - 机器人1
                const discardLayout = document.createElement('div');
                discardLayout.style.display = 'flex';
                discardLayout.style.width = '100%';
                discardLayout.style.height = '100%';
                discardLayout.style.gap = '10px';
                discardLayout.style.minHeight = '0';
                discardLayout.style.overflow = 'hidden';
            
            // 左1/4 - 机器人3弃牌
            const leftDiscardArea = document.createElement('div');
            leftDiscardArea.style.flex = '1';
            leftDiscardArea.style.display = 'flex';
            leftDiscardArea.style.flexDirection = 'column';
            leftDiscardArea.style.border = '1px solid #cccccc';
            leftDiscardArea.style.borderRadius = '8px';
            leftDiscardArea.style.padding = '5px';
            leftDiscardArea.style.overflow = 'hidden';
            leftDiscardArea.style.minHeight = '0';
            
            // 如果是当前玩家，添加金色边框
            if (game.currentPlayerIndex === 3) {
                leftDiscardArea.style.border = '3px solid #FFD700';
                leftDiscardArea.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            const leftDiscardedTiles = createDiscardedTilesElement(3);
            leftDiscardArea.appendChild(leftDiscardedTiles);
            
            // 中间1/2 - 分成上下两部分
            const centerDiscardArea = document.createElement('div');
            centerDiscardArea.style.flex = '2';
            centerDiscardArea.style.display = 'flex';
            centerDiscardArea.style.flexDirection = 'column';
            centerDiscardArea.style.gap = '10px';
            centerDiscardArea.style.height = '100%';
            centerDiscardArea.style.minHeight = '0';
            centerDiscardArea.style.overflow = 'hidden';
            
            // 上半部分 - 机器人2弃牌
            const topCenterArea = document.createElement('div');
            topCenterArea.style.flex = '1';
            topCenterArea.style.display = 'flex';
            topCenterArea.style.flexDirection = 'column';
            topCenterArea.style.border = '1px solid #cccccc';
            topCenterArea.style.borderRadius = '8px';
            topCenterArea.style.padding = '5px';
            topCenterArea.style.overflow = 'hidden';
            topCenterArea.style.minHeight = '0';
            
            // 如果是当前玩家，添加金色边框
            if (game.currentPlayerIndex === 2) {
                topCenterArea.style.border = '3px solid #FFD700';
                topCenterArea.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            const topCenterDiscardedTiles = createDiscardedTilesElement(2);
            topCenterArea.appendChild(topCenterDiscardedTiles);
            
            // 下半部分 - 玩家弃牌
            const bottomCenterArea = document.createElement('div');
            bottomCenterArea.style.flex = '1';
            bottomCenterArea.style.display = 'flex';
            bottomCenterArea.style.flexDirection = 'column';
            bottomCenterArea.style.border = '1px solid #cccccc';
            bottomCenterArea.style.borderRadius = '8px';
            bottomCenterArea.style.padding = '5px';
            bottomCenterArea.style.overflow = 'hidden';
            bottomCenterArea.style.minHeight = '0';
            
            // 如果是当前玩家，添加金色边框
            if (game.currentPlayerIndex === 0) {
                bottomCenterArea.style.border = '3px solid #FFD700';
                bottomCenterArea.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            const bottomCenterDiscardedTiles = createDiscardedTilesElement(0);
            bottomCenterArea.appendChild(bottomCenterDiscardedTiles);
            
            centerDiscardArea.appendChild(topCenterArea);
            centerDiscardArea.appendChild(bottomCenterArea);
            
            // 右1/4 - 机器人1弃牌
            const rightDiscardArea = document.createElement('div');
            rightDiscardArea.style.flex = '1';
            rightDiscardArea.style.display = 'flex';
            rightDiscardArea.style.flexDirection = 'column';
            rightDiscardArea.style.border = '1px solid #cccccc';
            rightDiscardArea.style.borderRadius = '8px';
            rightDiscardArea.style.padding = '5px';
            rightDiscardArea.style.overflow = 'hidden';
            rightDiscardArea.style.minHeight = '0';
            
            // 如果是当前玩家，添加金色边框
            if (game.currentPlayerIndex === 1) {
                rightDiscardArea.style.border = '3px solid #FFD700';
                rightDiscardArea.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.5)';
            }
            
            const rightDiscardedTiles = createDiscardedTilesElement(1);
            rightDiscardArea.appendChild(rightDiscardedTiles);
            
            discardLayout.appendChild(leftDiscardArea);
            discardLayout.appendChild(centerDiscardArea);
            discardLayout.appendChild(rightDiscardArea);
            
            area.appendChild(discardLayout);
            }
        }
        
        gameBoard.appendChild(area);
    });
}

// 根据牌的系列获取颜色
function getSeriesColor(series) {
    const seriesColors = {
        "μ's": '#4CAF50',                    // 绿色
        'Aqours': '#2196F3',                 // 蓝色
        '虹咲': '#FF9800', // 橙色
        'Liella!': '#9C27B0',                // 紫色
        '莲之空': '#F44336', // 红色
        '人生不易部!': '#00BCD4',            // 青色
        '音乐剧': '#8BC34A'        // 浅绿色
    };
    return seriesColors[series] || '#9E9E9E';
}

// 选择牌
function selectTile(tile) {
    if (game.state !== GameState.PLAYING) return;
    if (game.players[game.currentPlayerIndex].type !== PlayerType.HUMAN) return;
    
    // 如果已立直，只能选择刚摸到的牌
    if (game.isRiichi[game.currentPlayerIndex]) {
        const lastDrawn = game.lastDrawnTile[game.currentPlayerIndex];
        if (!lastDrawn || tile.uniqueId !== lastDrawn.uniqueId) {
            alert('立直后只能打出刚摸到的牌！');
            return;
        }
    }
    
    // 取消之前的选择
    if (game.selectedTile) {
        const prevTile = document.querySelector(`[data-unique-id="${game.selectedTile.uniqueId}"]`);
        if (prevTile) prevTile.classList.remove('selected');
    }
    
    // 选择当前牌
    game.selectedTile = tile;
    const currentTile = document.querySelector(`[data-unique-id="${tile.uniqueId}"]`);
    if (currentTile) currentTile.classList.add('selected');
    
    // 直接更新出牌按钮的disabled状态
    const discardButton = document.getElementById('discard-tile');
    if (discardButton) {
        discardButton.disabled = false;
    }
}

// 打出牌
function discardTile() {
    if (!game.selectedTile) return;
    
    const currentPlayer = game.players[game.currentPlayerIndex];
    
    // 如果已立直，只能打出刚摸到的牌
    if (game.isRiichi[game.currentPlayerIndex]) {
        const lastDrawn = game.lastDrawnTile[game.currentPlayerIndex];
        if (!lastDrawn || game.selectedTile.uniqueId !== lastDrawn.uniqueId) {
            alert('立直后只能打出刚摸到的牌！');
            return;
        }
    }
    
    // 从手牌中移除
    const tileIndex = currentPlayer.hand.findIndex(t => t.uniqueId === game.selectedTile.uniqueId);
    if (tileIndex === -1) return;
    
    const discardedTile = currentPlayer.hand.splice(tileIndex, 1)[0];
    game.discardedTiles.push(discardedTile);
    game.playerDiscardedTiles[game.currentPlayerIndex].push(discardedTile); // 添加到当前玩家的弃牌堆
    game.lastDiscardedTile = discardedTile; // 记录上一位玩家打出的牌（用于吃牌判断）
    game.lastDiscardingPlayerIndex = game.currentPlayerIndex; // 记录上一位打出牌的玩家（用于吃牌判断）
    game.globalLastDiscardedTile = discardedTile; // 记录所有玩家中最后被打出的牌（用于显示红色边框）
    game.globalLastDiscardingPlayerIndex = game.currentPlayerIndex; // 记录所有玩家中最后打出牌的玩家（用于显示红色边框）
    game.selectedTile = null;
    game.lastDrawnTile[game.currentPlayerIndex] = null; // 清空刚摸到的牌
    
    // 检查其他已立直的玩家是否可以荣和
    for (let i = 0; i < 4; i++) {
        if (i !== game.currentPlayerIndex && game.isRiichi[i]) {
            if (checkRon(game.players[i], discardedTile)) {
                // 荣和，游戏结束
                endGame(game.players[i], discardedTile);
                return;
            }
        }
    }
    
    // 检查是否可以立直（仅人类玩家且未立直时）
    if (currentPlayer.type === PlayerType.HUMAN && !game.isRiichi[game.currentPlayerIndex]) {
        if (checkTenpai(currentPlayer.hand, game.currentPlayerIndex)) {
            // 显示立直宣告按钮
            game.showRiichiButtons = true;
            game.pendingNextPlayer = true;
            renderGame();
            return;
        }
    }
    
    // 切换到下一个玩家
    nextPlayer();
}

// 宣告立直
function declareRiichi() {
    const currentPlayerIndex = game.currentPlayerIndex;
    game.isRiichi[currentPlayerIndex] = true;
    game.riichiTileIndex[currentPlayerIndex] = game.playerDiscardedTiles[currentPlayerIndex].length - 1;
    game.showRiichiButtons = false;
    game.pendingNextPlayer = false;
    renderGame();
    nextPlayer();
}

// 不宣告立直
function skipRiichi() {
    game.showRiichiButtons = false;
    game.pendingNextPlayer = false;
    renderGame();
    nextPlayer();
}

// 检查是否胜利
function checkWin(hand, playerId) {
    // 收集所有牌（手牌 + 吃牌区的牌）
    const allTiles = [...hand];
    
    // 添加吃牌区的牌
    if (playerId !== undefined && game.playerChiTiles[playerId]) {
        game.playerChiTiles[playerId].forEach(chiGroup => {
            chiGroup.forEach(tile => {
                allTiles.push(tile);
            });
        });
    }
    
    // 胜利条件：9张牌
    if (allTiles.length !== 9) return false;
    
    // 统计每个系列的牌数（包括该系列的万能牌）
    const seriesGroups = {};
    
    allTiles.forEach(card => {
        const series = card.series;
        if (!seriesGroups[series]) {
            seriesGroups[series] = 0;
        }
        seriesGroups[series]++;
    });
    
    const seriesList = Object.keys(seriesGroups);
    
    // 胜利条件1：9张牌都是同一系列的牌
    if (seriesList.length === 1 && seriesGroups[seriesList[0]] >= 9) {
        return true;
    }
    
    // 胜利条件2：9张牌由3组牌构成，每组3张，每组同一系列，且三组不同系列
    // 检查是否有至少3个不同的系列
    if (seriesList.length >= 3) {
        // 找出有至少3张牌的系列
        const validSeries = seriesList.filter(series => seriesGroups[series] >= 3);
        if (validSeries.length >= 3) {
            return true;
        }
    }
    
    return false;
}

// 检查某张牌是否可以让某个玩家胜利（荣和）
function checkRon(player, discardedTile) {
    if (!game.isRiichi[player.id]) return false;
    
    // 只传递手牌 + 被打出的牌，checkWin 会自己添加吃牌区的牌
    const testHand = [...player.hand, discardedTile];
    
    // 检查是否满足胜利条件
    return checkWin(testHand, player.id);
}

// 检查是否可以吃牌
function checkCanChi(playerHand, discardedTile) {
    if (!discardedTile) return { canChi: false, availableTiles: [] };
    
    const discardedSeries = discardedTile.series;
    
    // 统计玩家手牌中该系列的牌数
    const sameSeriesTiles = playerHand.filter(tile => tile.series === discardedSeries);
    
    // 如果该系列的牌 >= 2，则可以吃
    if (sameSeriesTiles.length >= 2) {
        // 返回所有同系列的牌（供用户选择）
        return {
            canChi: true,
            availableTiles: sameSeriesTiles
        };
    }
    
    return { canChi: false, availableTiles: [] };
}

// 检查是否听牌（差一张就可以胜利）
function checkTenpai(hand, playerId) {
    // 收集所有牌（手牌 + 吃牌区的牌）
    const allTiles = [...hand];
    
    // 添加吃牌区的牌
    if (playerId !== undefined && game.playerChiTiles[playerId]) {
        game.playerChiTiles[playerId].forEach(chiGroup => {
            chiGroup.forEach(tile => {
                allTiles.push(tile);
            });
        });
    }
    
    // 听牌条件：8张牌时，差一张就可以胜利
    if (allTiles.length !== 8) return false;
    
    // 最简单直接的方法：
    // 既然我们已经有了 checkWin 函数，
    // 我们直接尝试添加各种可能的牌，看是否能胜利
    
    // 1. 测试添加万能牌
    const wildcard = { type: 'wildcard', series: '测试' };
    if (checkWin([...allTiles, wildcard])) {
        return true;
    }
    
    // 2. 测试添加每个系列的成员牌
    const testSeries = ["μ's", 'Aqours', '虹咲', 'Liella!', '莲之空', '人生不易部!', '音乐剧'];
    for (const series of testSeries) {
        const testTile = { type: 'member', series: series };
        if (checkWin([...allTiles, testTile])) {
            return true;
        }
    }
    
    return false;
}

// 下一个玩家
function nextPlayer() {
    game.currentPlayerIndex = (game.currentPlayerIndex + 1) % 4;
    const currentPlayer = game.players[game.currentPlayerIndex];
    
    // 更新当前回合信息
    const gameInfoElement = document.getElementById('game-info');
    if (gameInfoElement) {
        gameInfoElement.textContent = `当前回合: ${currentPlayer.name}`;
    }
    
    // 重置吃牌相关状态
    game.showChiButtons = false;
    game.canChi = false;
    game.chiAvailableTiles = [];
    game.chiSelectedTiles = [];
    game.chiStep = 1;
    
    // 计算上家的玩家索引
    const previousPlayerIndex = (game.currentPlayerIndex - 1 + 4) % 4;
    
    // 只有当上家刚打出牌，且玩家未立直，且吃牌次数少于2次时，才检查是否可以吃牌
    if (!game.isRiichi[game.currentPlayerIndex] && 
        game.lastDiscardedTile && 
        game.lastDiscardingPlayerIndex === previousPlayerIndex &&
        game.chiCount[game.currentPlayerIndex] < 2) {
        const chiResult = checkCanChi(currentPlayer.hand, game.lastDiscardedTile);
        if (chiResult.canChi) {
            game.canChi = true;
            game.chiAvailableTiles = chiResult.availableTiles;
            
            // 如果是人类玩家，显示吃牌按钮
            if (currentPlayer.type === PlayerType.HUMAN) {
                game.showChiButtons = true;
                renderGame();
                return;
            } else {
                // AI玩家，80%概率吃牌
                if (Math.random() < 0.8) {
                    // 先渲染界面显示上家的弃牌
                    renderGame();
                    // AI选择前两张牌进行吃牌，先停顿1秒钟
                    addTimer(() => {
                        performChi(currentPlayer, game.chiAvailableTiles.slice(0, 2), game.lastDiscardedTile);
                    }, 1000);
                    return;
                }
            }
        }
    }
    
    // 如果没有吃上家的牌，清除上一张牌记录，防止下一个玩家也尝试吃这张牌
    if (!game.canChi) {
        game.lastDiscardedTile = null;
        game.lastDiscardingPlayerIndex = -1;
    }
    
    // 不能吃牌或选择不吃，正常抽牌
    drawTileAndProceed(currentPlayer);
}

// 抽牌并继续游戏
function drawTileAndProceed(currentPlayer) {
    // 抽牌
    if (game.deck.length > 0) {
        const drawnTile = game.deck.pop();
        currentPlayer.hand.push(drawnTile);
        game.lastDrawnTile[game.currentPlayerIndex] = drawnTile;
        
        // 检查是否胜利（只有立直后才能胜利）
        if (game.isRiichi[game.currentPlayerIndex] && checkWin(currentPlayer.hand, game.currentPlayerIndex)) {
            if (currentPlayer.type === PlayerType.HUMAN) {
                game.showHuButtons = true;
                game.pendingRonTile = null;
            } else {
                endGame(currentPlayer);
                return;
            }
        }
    } else {
        // 牌库耗尽，游戏结束
        endGameDeckExhausted();
        return;
    }
    
    // 如果是AI玩家，自动进行游戏
    if (currentPlayer.type === PlayerType.AI) {
        addTimer(() => {
            aiTurn(currentPlayer);
        }, 800);
    }
    
    renderGame();
}

// 显示吃牌通知
function showChiNotification(playerName, discardedPlayerName, tileName) {
    const notification = document.getElementById('chi-notification');
    notification.textContent = `${playerName} 吃了 ${discardedPlayerName} 的 ${tileName}`;
    notification.classList.add('show');
    
    // 2.5秒后隐藏
    addTimer(() => {
        notification.classList.remove('show');
    }, 2500);
}

// 执行吃牌操作
function performChi(player, chiTiles, discardedTile) {
    const currentPlayerIndex = player.id;
    
    // 显示吃牌通知
    const previousPlayerIndex = (currentPlayerIndex - 1 + 4) % 4;
    const previousPlayer = game.players[previousPlayerIndex];
    showChiNotification(player.name, previousPlayer.name, discardedTile.name);
    
    // 从手牌中移除用来吃牌的两张牌
    chiTiles.forEach(tile => {
        const index = player.hand.findIndex(t => t.uniqueId === tile.uniqueId);
        if (index !== -1) {
            player.hand.splice(index, 1);
        }
    });
    
    // 从上家的弃牌堆中移除被吃的牌
    const discardedIndex = game.playerDiscardedTiles[previousPlayerIndex].findIndex(
        t => t.uniqueId === discardedTile.uniqueId
    );
    if (discardedIndex !== -1) {
        game.playerDiscardedTiles[previousPlayerIndex].splice(discardedIndex, 1);
    }
    
    // 从总弃牌堆中移除
    const totalDiscardedIndex = game.discardedTiles.findIndex(
        t => t.uniqueId === discardedTile.uniqueId
    );
    if (totalDiscardedIndex !== -1) {
        game.discardedTiles.splice(totalDiscardedIndex, 1);
    }
    
    // 将三张牌添加到吃牌区
    const chiGroup = [...chiTiles, discardedTile];
    game.playerChiTiles[currentPlayerIndex].push(chiGroup);
    
    // 增加吃牌次数
    game.chiCount[currentPlayerIndex]++;
    
    // 重置上一张打出的牌
    game.lastDiscardedTile = null;
    game.lastDiscardingPlayerIndex = -1;
    
    // 重置吃牌相关状态
    game.showChiButtons = false;
    game.canChi = false;
    game.chiAvailableTiles = [];
    game.chiSelectedTiles = [];
    game.chiStep = 1;
    
    // 吃牌后，玩家需要打出一张牌
    if (player.type === PlayerType.HUMAN) {
        renderGame();
    } else {
        // AI玩家自动打牌
        addTimer(() => {
            aiTurnAfterChi(player);
        }, 1500);
    }
}

// AI玩家吃牌后的回合
function aiTurnAfterChi(player) {
    // 随机选择一张牌打出
    const randomIndex = Math.floor(Math.random() * player.hand.length);
    const discardedTile = player.hand.splice(randomIndex, 1)[0];
    game.discardedTiles.push(discardedTile);
    game.playerDiscardedTiles[player.id].push(discardedTile);
    game.lastDiscardedTile = discardedTile;
    game.lastDiscardingPlayerIndex = player.id; // 记录打出牌的玩家（用于吃牌判断）
    game.globalLastDiscardedTile = discardedTile; // 记录所有玩家中最后被打出的牌（用于显示红色边框）
    game.globalLastDiscardingPlayerIndex = player.id; // 记录所有玩家中最后打出牌的玩家（用于显示红色边框）
    
    // 检查其他已立直的玩家是否可以荣和
    for (let i = 0; i < 4; i++) {
        if (i !== player.id && game.isRiichi[i]) {
            if (checkRon(game.players[i], discardedTile)) {
                // 荣和，游戏结束
                endGame(game.players[i], discardedTile);
                return;
            }
        }
    }
    
    // 检查是否可以立直
    if (!game.isRiichi[player.id]) {
        if (checkTenpai(player.hand, player.id) && Math.random() < 0.8) {
            game.isRiichi[player.id] = true;
            game.riichiTileIndex[player.id] = game.playerDiscardedTiles[player.id].length - 1;
        }
    }
    
    // 下一个玩家
    nextPlayer();
}

// 开始选择吃牌用的牌
function startSelectChiTiles() {
    game.chiStep = 2;
    game.chiSelectedTiles = [];
    renderGame();
}

// 切换吃牌选择
function toggleChiTileSelection(tile) {
    // 检查牌是否在可用列表中
    const isAvailable = game.chiAvailableTiles.some(t => t.uniqueId === tile.uniqueId);
    if (!isAvailable) {
        return;
    }
    
    // 检查牌是否已选中
    const index = game.chiSelectedTiles.findIndex(t => t.uniqueId === tile.uniqueId);
    
    if (index !== -1) {
        // 取消选中
        game.chiSelectedTiles.splice(index, 1);
    } else {
        // 选中牌（最多选2张）
        if (game.chiSelectedTiles.length < 2) {
            game.chiSelectedTiles.push(tile);
        }
    }
    
    renderGame();
}

// 确认吃牌
function confirmChi() {
    // 验证选择的牌是否有效
    if (game.chiSelectedTiles.length !== 2) {
        alert('请选择2张牌！');
        return;
    }
    
    // 验证选择的牌是否都与上家的牌同系列
    const discardedSeries = game.lastDiscardedTile.series;
    const allSameSeries = game.chiSelectedTiles.every(tile => tile.series === discardedSeries);
    
    if (!allSameSeries) {
        alert('选择的牌必须与上家的牌同系列！');
        return;
    }
    
    // 执行吃牌
    const currentPlayer = game.players[game.currentPlayerIndex];
    performChi(currentPlayer, game.chiSelectedTiles, game.lastDiscardedTile);
}

// 取消选择吃牌
function cancelSelectChiTiles() {
    game.chiStep = 1;
    game.chiSelectedTiles = [];
    renderGame();
}

// 宣告吃牌
function declareChi() {
    const currentPlayer = game.players[game.currentPlayerIndex];
    performChi(currentPlayer, game.chiAvailableTiles, game.lastDiscardedTile);
}

// 不吃牌
function skipChi() {
    game.showChiButtons = false;
    game.canChi = false;
    game.chiAvailableTiles = [];
    
    // 清除上一张牌记录，防止下一个玩家也尝试吃这张牌
    game.lastDiscardedTile = null;
    game.lastDiscardingPlayerIndex = -1;
    
    const currentPlayer = game.players[game.currentPlayerIndex];
    drawTileAndProceed(currentPlayer);
}

// AI回合
function aiTurn(player) {
    // 检查是否胜利（只有立直后才能胜利）
    if (game.isRiichi[player.id] && checkWin(player.hand, player.id)) {
        endGame(player);
        return;
    }
    
    addTimer(() => {
        let discardedTile = null;
        
        // 如果未立直，检查是否可以立直
        if (!game.isRiichi[player.id]) {
            // 随机选择一张牌打出
            const randomIndex = Math.floor(Math.random() * player.hand.length);
            discardedTile = player.hand.splice(randomIndex, 1)[0];
            game.discardedTiles.push(discardedTile);
            game.playerDiscardedTiles[player.id].push(discardedTile);
            
            // 检查是否听牌，如果听牌则自动立直（80%概率）
            if (checkTenpai(player.hand, player.id) && Math.random() < 0.8) {
                game.isRiichi[player.id] = true;
                game.riichiTileIndex[player.id] = game.playerDiscardedTiles[player.id].length - 1;
            }
        } else {
            // 已立直，只能打刚摸到的牌
            const lastDrawn = game.lastDrawnTile[player.id];
            if (lastDrawn) {
                // 找到刚摸到的牌
                const tileIndex = player.hand.findIndex(t => t.uniqueId === lastDrawn.uniqueId);
                if (tileIndex !== -1) {
                    discardedTile = player.hand.splice(tileIndex, 1)[0];
                    game.discardedTiles.push(discardedTile);
                    game.playerDiscardedTiles[player.id].push(discardedTile);
                    game.lastDrawnTile[player.id] = null;
                }
            }
        }
        
        // 记录最后打出的牌和打出牌的玩家
        if (discardedTile) {
            game.lastDiscardedTile = discardedTile;
            game.lastDiscardingPlayerIndex = player.id; // 用于吃牌判断
            game.globalLastDiscardedTile = discardedTile; // 用于显示红色边框
            game.globalLastDiscardingPlayerIndex = player.id; // 用于显示红色边框
            
            // 检查其他已立直的玩家是否可以荣和
            for (let i = 0; i < 4; i++) {
                if (i !== player.id && game.isRiichi[i]) {
                    if (checkRon(game.players[i], discardedTile)) {
                        if (game.players[i].type === PlayerType.HUMAN) {
                            game.showHuButtons = true;
                            game.pendingRonTile = discardedTile;
                            game.pendingRonPlayerIndex = i;
                            renderGame();
                            return;
                        } else {
                            // 荣和，游戏结束
                            endGame(game.players[i], discardedTile);
                            return;
                        }
                    }
                }
            }
        }
        
        // 下一个玩家
        nextPlayer();
    }, 1500);
}

// 结束游戏
// 计算生日月份额外分数
function calculateBirthdayBonus(tiles) {
    const monthCount = {};
    const bonusItems = [];
    
    tiles.forEach(tile => {
        if (tile.type !== 'wildcard' && tile.birthdayMonth) {
            const month = tile.birthdayMonth;
            if (!monthCount[month]) {
                monthCount[month] = 0;
            }
            monthCount[month]++;
        }
    });
    
    // 检查每个月份是否>=3
    for (const month in monthCount) {
        if (monthCount[month] >= 3) {
            // 从配置中获取该月份的分数，如果不存在则使用默认值60000
            const score = game.birthdayMonthScores[parseInt(month)] || 60000;
            bonusItems.push({
                type: 'birthday',
                month: parseInt(month),
                score: score
            });
        }
    }
    
    return bonusItems;
}

// 计算学年额外分数
function calculateGradeBonus(tiles) {
    const gradeCount = {};
    const bonusItems = [];
    
    tiles.forEach(tile => {
        if (tile.type !== 'wildcard' && tile.grade) {
            const grade = tile.grade;
            if (!gradeCount[grade]) {
                gradeCount[grade] = 0;
            }
            gradeCount[grade]++;
        }
    });
    
    // 检查每个年级是否>=5
    for (const grade in gradeCount) {
        if (gradeCount[grade] >= 5) {
            // 您可以在这里修改各学年的分数
            bonusItems.push({
                type: 'grade',
                grade: parseInt(grade),
                score: 60000
            });
        }
    }
    
    return bonusItems;
}

// 计算小组额外分数
function calculateGroupBonus(tiles) {
    const bonusItems = [];
    
    // 统计胜利牌中的所有小组成员
    const tileNames = tiles.filter(tile => tile.type !== 'wildcard').map(tile => tile.name);
    
    // 检查每个小组
    for (const groupName in game.groupMembers) {
        const groupMembers = game.groupMembers[groupName];
        let hasAllMembers = true;
        
        // 检查小组的每个成员是否都在胜利牌中
        for (const memberName of groupMembers) {
            if (!tileNames.includes(memberName)) {
                hasAllMembers = false;
                break;
            }
        }
        
        if (hasAllMembers) {
            // 从配置中获取该小组的分数，如果不存在则使用默认值60000
            const score = game.groupScores[groupName] || 60000;
            bonusItems.push({
                type: 'group',
                groupName: groupName,
                score: score
            });
        }
    }
    
    return bonusItems;
}

// 按系列顺序对牌进行排序
function sortTilesBySeries(tiles) {
    return [...tiles].sort((a, b) => {
        const indexA = game.seriesOrder.indexOf(a.series);
        const indexB = game.seriesOrder.indexOf(b.series);
        
        if (indexA !== indexB) {
            return indexA - indexB;
        }
        
        if (a.type !== b.type) {
            return a.type === 'member' ? -1 : 1;
        }
        
        return a.name.localeCompare(b.name);
    });
}

// 计算胜利类型和分数
function calculateWinTypeAndScore(player, ronTile = null) {
    const allTiles = [...player.hand];
    
    // 添加吃牌区的牌
    game.playerChiTiles[player.id].forEach(chiGroup => {
        chiGroup.forEach(tile => {
            allTiles.push(tile);
        });
    });
    
    // 如果有荣和牌，添加进去
    if (ronTile) {
        allTiles.push(ronTile);
    }
    
    // 统计每个系列的牌数
    const seriesGroups = {};
    allTiles.forEach(card => {
        const series = card.series;
        if (!seriesGroups[series]) {
            seriesGroups[series] = 0;
        }
        seriesGroups[series]++;
    });
    
    const seriesList = Object.keys(seriesGroups);
    
    // 判断胜利类型并计算分数
    let winType = '';
    let baseScore = 0;
    let winTiles = [...allTiles];
    
    if (seriesList.length === 1) {
        winType = '清一色';
        baseScore = 420000;
    } else {
        const validSeries = seriesList.filter(series => seriesGroups[series] >= 3);
        if (validSeries.length >= 3) {
            winType = '3系列阵型';
            baseScore = 60000;
        }
    }
    
    // 计算额外分数
    const birthdayBonuses = calculateBirthdayBonus(allTiles);
    const gradeBonuses = calculateGradeBonus(allTiles);
    const groupBonuses = calculateGroupBonus(allTiles);
    
    return { winType, baseScore, winTiles, birthdayBonuses, gradeBonuses, groupBonuses };
}

// 牌库耗尽，游戏结束
function endGameDeckExhausted() {
    game.state = GameState.ENDED;
    showFinalSettlementDeckExhausted();
}

function endGame(winner, ronTile = null) {
    game.state = GameState.ENDED;
    
    // 计算胜利类型和分数
    const { winType, baseScore, winTiles, birthdayBonuses, gradeBonuses, groupBonuses } = calculateWinTypeAndScore(winner, ronTile);
    
    // 显示终局结算界面
    showFinalSettlement(winner, winType, baseScore, winTiles, birthdayBonuses, gradeBonuses, groupBonuses);
}

// 显示牌库耗尽的终局结算界面
function showFinalSettlementDeckExhausted() {
    const modal = document.getElementById('final-settlement-modal');
    const winnerNameDiv = document.getElementById('winner-name');
    const winTypeScoreDiv = document.getElementById('win-type-score');
    const bonusScoresDiv = document.getElementById('bonus-scores');
    const totalScoreDiv = document.getElementById('total-score');
    const winningTilesDiv = document.getElementById('winning-tiles');
    const closeBtn = document.getElementById('close-settlement');
    
    // 设置牌库耗尽信息
    winnerNameDiv.textContent = '牌库耗尽';
    
    // 设置胜利类型和基本分数
    winTypeScoreDiv.textContent = '游戏结束，无人胡牌';
    
    // 隐藏额外分数
    bonusScoresDiv.style.display = 'none';
    
    // 隐藏总分数
    totalScoreDiv.style.display = 'none';
    
    // 清空胜利手牌
    winningTilesDiv.innerHTML = '';
    
    // 显示模态框
    modal.classList.add('show');
    
    // 关闭按钮事件
    closeBtn.onclick = function() {
        modal.classList.remove('show');
    };
}

// 显示终局结算界面
function showFinalSettlement(winner, winType, baseScore, winTiles, birthdayBonuses, gradeBonuses, groupBonuses) {
    const modal = document.getElementById('final-settlement-modal');
    const winnerNameDiv = document.getElementById('winner-name');
    const winTypeScoreDiv = document.getElementById('win-type-score');
    const bonusScoresDiv = document.getElementById('bonus-scores');
    const totalScoreDiv = document.getElementById('total-score');
    const winningTilesDiv = document.getElementById('winning-tiles');
    const closeBtn = document.getElementById('close-settlement');
    
    // 确保所有元素都可见
    bonusScoresDiv.style.display = 'block';
    totalScoreDiv.style.display = 'block';
    
    // 设置胜利者姓名
    winnerNameDiv.textContent = `${winner.name} 胜利了！`;
    
    // 设置胜利类型和基本分数
    winTypeScoreDiv.textContent = `基本分数： ${winType} ${baseScore.toLocaleString()}分`;
    
    // 计算额外分数总和
    let bonusTotal = 0;
    
    // 设置额外分数
    bonusScoresDiv.innerHTML = '';
    let hasBonus = false;
    
    // 添加生日月份额外分数
    birthdayBonuses.forEach(bonus => {
        hasBonus = true;
        bonusTotal += bonus.score;
        const bonusItem = document.createElement('div');
        bonusItem.className = 'bonus-item';
        bonusItem.textContent = `${bonus.month}月份生日 +${bonus.score.toLocaleString()}分`;
        bonusScoresDiv.appendChild(bonusItem);
    });
    
    // 添加学年额外分数
    gradeBonuses.forEach(bonus => {
        hasBonus = true;
        bonusTotal += bonus.score;
        const bonusItem = document.createElement('div');
        bonusItem.className = 'bonus-item';
        bonusItem.textContent = `${bonus.grade}年级生 +${bonus.score.toLocaleString()}分`;
        bonusScoresDiv.appendChild(bonusItem);
    });
    
    // 添加小组额外分数
    groupBonuses.forEach(bonus => {
        hasBonus = true;
        bonusTotal += bonus.score;
        const bonusItem = document.createElement('div');
        bonusItem.className = 'bonus-item';
        bonusItem.textContent = `${bonus.groupName} +${bonus.score.toLocaleString()}分`;
        bonusScoresDiv.appendChild(bonusItem);
    });
    
    // 如果没有额外分数，隐藏该区域
    if (!hasBonus) {
        bonusScoresDiv.style.display = 'none';
    } else {
        bonusScoresDiv.style.display = 'block';
        // 在额外分数前添加标签
        if (!bonusScoresDiv.firstChild || bonusScoresDiv.firstChild.className !== 'bonus-label') {
            const bonusLabel = document.createElement('div');
            bonusLabel.className = 'bonus-label';
            bonusLabel.style.fontWeight = 'bold';
            bonusLabel.style.marginBottom = '10px';
            bonusLabel.textContent = '额外分数：';
            bonusScoresDiv.insertBefore(bonusLabel, bonusScoresDiv.firstChild);
        }
    }
    
    // 设置总分数
    const totalScore = baseScore + bonusTotal;
    totalScoreDiv.textContent = `总分数： ${totalScore.toLocaleString()}分`;
    
    // 清空并重新填充胜利手牌（按系列排序）
    winningTilesDiv.innerHTML = '';
    const sortedWinTiles = sortTilesBySeries(winTiles);
    sortedWinTiles.forEach(tile => {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.style.backgroundColor = getSeriesColor(tile.series);
        
        if (tile.type === 'wildcard') {
            tileElement.style.border = '2px dashed #FFD700';
        }
        
        const img = document.createElement('img');
        img.src = tile.imageUrl;
        img.alt = tile.name;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        img.onerror = function() {
            tileElement.removeChild(img);
            tileElement.textContent = tile.name;
            tileElement.style.display = 'flex';
            tileElement.style.justifyContent = 'center';
            tileElement.style.alignItems = 'center';
            tileElement.style.fontSize = '12px';
            tileElement.style.textAlign = 'center';
            tileElement.style.padding = '5px';
        };
        
        tileElement.appendChild(img);
        winningTilesDiv.appendChild(tileElement);
    });
    
    // 显示模态框
    modal.classList.add('show');
    
    // 关闭按钮事件
    closeBtn.onclick = function() {
        modal.classList.remove('show');
    };
}

// 开始游戏
function startGame() {
    initGame();
    game.state = GameState.PLAYING;
    
    // 分发牌
    dealTiles();
    
    // 第一个玩家抽牌
    const firstPlayer = game.players[game.currentPlayerIndex];
    if (game.deck.length > 0) {
        const drawnTile = game.deck.pop();
        firstPlayer.hand.push(drawnTile);
        game.lastDrawnTile[game.currentPlayerIndex] = drawnTile;
        
        // 检查是否胜利（只有立直后才能胜利）
        if (game.isRiichi[game.currentPlayerIndex] && checkWin(firstPlayer.hand, game.currentPlayerIndex)) {
            endGame(firstPlayer);
            return;
        }
    } else {
        // 牌库耗尽，游戏结束
        endGameDeckExhausted();
        return;
    }
    
    // 如果第一个玩家是AI，自动进行游戏
    if (firstPlayer.type === PlayerType.AI) {
        addTimer(() => {
            aiTurn(firstPlayer);
        }, 1500);
    }
    
    renderGame();
}

// 重新开始游戏
function restartGame() {
    startGame();
}

// 玩家选择胡牌
function declareHu() {
    if (game.pendingRonTile) {
        // 荣和胡牌
        const winner = game.players[game.pendingRonPlayerIndex];
        endGame(winner, game.pendingRonTile);
    } else {
        // 自摸胡牌
        const winner = game.players[game.currentPlayerIndex];
        endGame(winner);
    }
    game.showHuButtons = false;
    game.pendingRonTile = null;
    game.pendingRonPlayerIndex = -1;
}

// 玩家选择不胡牌
function skipHu() {
    if (game.pendingRonTile) {
        // 荣和不胡，继续游戏
        game.showHuButtons = false;
        game.pendingRonTile = null;
        game.pendingRonPlayerIndex = -1;
        // 下一个玩家
        nextPlayer();
    } else {
        // 自摸不胡，继续游戏，玩家需要打出一张牌
        game.showHuButtons = false;
    }
    renderGame();
}

// 事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏
    initGame();
    
    // 规则按钮点击事件
    const ruleBtn = document.getElementById('rule-btn');
    const ruleModal = document.getElementById('rule-modal');
    const closeRuleBtn = document.getElementById('close-rule');
    const ruleContent = document.getElementById('rule-content');
    
    if (ruleBtn) {
        ruleBtn.addEventListener('click', function() {
            // 加载规则文件内容
            fetch('rule.txt')
                .then(response => response.text())
                .then(text => {
                    // 将Markdown格式转换为HTML
                    let html = text
                        .replace(/^# (.+)$/gm, '<h2>$1</h2>')
                        .replace(/^## (.+)$/gm, '<h3>$1</h3>')
                        .replace(/^### (.+)$/gm, '<h4>$1</h4>')
                        .replace(/^\- (.+)$/gm, '<li>$1</li>')
                        .replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br>');
                    
                    ruleContent.innerHTML = html;
                    ruleModal.classList.add('show');
                })
                .catch(error => {
                    ruleContent.innerHTML = '无法加载规则文件：' + error.message;
                    ruleModal.classList.add('show');
                });
        });
    }
    
    if (closeRuleBtn) {
        closeRuleBtn.addEventListener('click', function() {
            ruleModal.classList.remove('show');
        });
    }
    
    // 点击弹窗外部关闭
    ruleModal.addEventListener('click', function(e) {
        if (e.target === ruleModal) {
            ruleModal.classList.remove('show');
        }
    });
});