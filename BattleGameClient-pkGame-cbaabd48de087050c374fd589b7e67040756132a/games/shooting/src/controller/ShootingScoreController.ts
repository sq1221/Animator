class ShootingScoreController {
	private userHPs: { isDestroy: boolean, hp: DBArmature }[] = [];
	private competitorHPs: { isDestroy: boolean, hp: DBArmature }[] = [];
	private selfHPContainer: egret.DisplayObjectContainer;
	private competitorContainer: egret.DisplayObjectContainer;

	userScore: number;
	competitorScore: number;
	private userIndex: number;
	private competitorIndex: number;
	public constructor() {
		this.selfHPContainer = new egret.DisplayObjectContainer();
		this.competitorContainer = new egret.DisplayObjectContainer();

		this.userScore = 0;
		this.competitorScore = 0;
		let offset: number = 0;
		for (let i = 0; i < UserConfig.scores; i++) {
			let hp = AssetManager.getQuickDBArmature("HP");
			offset += 50;
			hp.y = offset;
			this.selfHPContainer.addChild(hp);
			let a = { isDestroy: false, hp: hp };
			this.userHPs.push(a);
		}
		offset = 0;
		for (let i = 0; i < UserConfig.scores; i++) {
			let hp = AssetManager.getQuickDBArmature("HP");
			hp.rotation = 180;
			offset += 50;
			hp.y = offset;
			this.competitorContainer.addChild(hp);
			let b = { isDestroy: false, hp: hp };
			this.competitorHPs.push(b);
		}
		this.userIndex = UserConfig.scores - 1;
		this.competitorIndex = UserConfig.scores - 1;

		this.selfHPContainer.y = 500 * GameShootingView.instance.adaptScaleY;
		this.selfHPContainer.x = 30;
		GameShootingView.instance.controlLayer.addChild(this.selfHPContainer);
		this.competitorContainer.y = 200 * GameShootingView.instance.adaptScaleY;
		this.competitorContainer.x = App.GameWidth - 30;
		GameShootingView.instance.controlLayer.addChild(this.competitorContainer);
	}
	/**
	 * 回掉包含音乐动画还有开启下一局需要参数
	 */

	win(next: (isNext: boolean) => void) {
		if (!this.competitorHPs[this.competitorIndex]) return;
		this.userScore++;
		this.competitorHPs[this.competitorIndex].isDestroy = true;
		this.competitorHPs[this.competitorIndex].hp.play("destroy", 1);
		this.competitorIndex--;
		if (this.userScore >= UserConfig.scores) {
			next(false);
			GameShootingView.instance.resultWin();
			this.sendmessage(3);
		} else {
			next(true);
		}

	}
	lose(next: (isNext: boolean) => void) {
		if (!this.userHPs[this.userIndex]) return;
		this.competitorScore++;
		this.userHPs[this.userIndex].isDestroy = true;
		this.userHPs[this.userIndex].hp.play("destroy", 1);
		this.userIndex--;
		if (this.competitorScore >= UserConfig.scores) {
			next(false);
			GameShootingView.instance.resultlose();
			this.sendmessage(1);
		} else {
			next(true);
		}
	}

	sendmessage(win: number) {
		App.MessageCenter.dispatch(EventMessage.SendGameResultC2S, win);
	}

	setUserScore(score: number) {
		if (score == this.userScore) return;
		if (score >= 0 && score <= UserConfig.scores) {
			let i = 1;
			for (; i <= score; i++) {
				if (!this.competitorHPs[UserConfig.scores - i].isDestroy) {
					this.competitorHPs[UserConfig.scores - i].isDestroy = true;
					this.competitorHPs[UserConfig.scores - i].hp.play("destroy", 1);
				}
			}
			i++;
			this.userIndex = UserConfig.scores - i;
			for (; i <= UserConfig.scores; i++) {
				this.competitorHPs[UserConfig.scores - i].isDestroy = false;
				this.competitorHPs[UserConfig.scores - i].hp.play("normal", 1);
			}
			this.userScore = score;
		}
	}

	setCompetitorScore(score: number) {
		if (score == this.competitorScore) return;
		if (score > 0 && score < UserConfig.scores) {
			let i = 1;
			for (; i <= score; i++) {
				if (!this.userHPs[UserConfig.scores - i].isDestroy) {
					this.userHPs[UserConfig.scores - i].isDestroy = true;
					this.userHPs[UserConfig.scores - i].hp.play("destroy", 1);
				}
			}
			i++;
			this.competitorIndex = UserConfig.scores - i;
			for (; i <= UserConfig.scores; i++) {
				this.userHPs[UserConfig.scores - i].isDestroy = false;
				this.userHPs[UserConfig.scores - i].hp.play("normal", 1);
			}
			this.competitorScore = score;
		}
	}
	dispose() {
		for (let HP of this.userHPs) {
			HP.isDestroy = false;
			HP.hp.parent.removeChild(HP.hp);
		}
		for (let HP of this.competitorHPs) {
			HP.isDestroy = false;
			HP.hp.parent.removeChild(HP.hp);
		}
		this.userHPs = [];
		this.competitorHPs = [];

		this.userScore = 0;
		this.competitorScore = 0;

		this.userIndex = 0;
		this.competitorIndex = 0;
	}
}
