class ShootingGetUID {
	private static _UID = 0;
	static getUID() {
		this._UID++;
		return this._UID;
	}
}