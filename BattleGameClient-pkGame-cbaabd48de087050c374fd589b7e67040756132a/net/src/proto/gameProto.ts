/**
 * Created by yangsong on 16/1/24.
 */

class Proto {
	private static dic:any = {}

	public static init():void{
		this.dic = {
			"1000":client_ping_c2s,
		"1001":client_network_c2s,
		"1002":client_network_s2c,
		"1999":error_notice_s2c,
		"2001":platform_login_c2s,
		"2002":platform_login_s2c,
		"3101":game_join_c2s,
		"3102":game_join_s2c,
		"3104":game_otherUserJoin_notice_s2c,
		"3001":game_loadProgress_c2s,
		"3002":game_loadProgress_notice_s2c,
		"3004":game_start_notice_s2c,
		"3005":game_exit_c2s,
		"3007":game_result_c2s,
		"3008":game_result_notice_s2c,
		"3009":game_event_c2s,
		"3010":game_event_notice_s2c,
		"3012":game_trunNumNotice_s2c,
		"3013":game_matching_c2s,
		"3014":game_matching_s2c,
		"3016":game_matching_notice_s2c,
		"3017":game_cancelMatching_c2s,
		"3018":game_cancelMatching_s2c,
		}
	}

	public static ID_client_ping_c2s:string = "1000";
	public static ID_client_network_c2s:string = "1001";
	public static ID_client_network_s2c:string = "1002";
	public static ID_error_notice_s2c:string = "1999";
	public static ID_platform_login_c2s:string = "2001";
	public static ID_platform_login_s2c:string = "2002";
	public static ID_game_join_c2s:string = "3101";
	public static ID_game_join_s2c:string = "3102";
	public static ID_game_otherUserJoin_notice_s2c:string = "3104";
	public static ID_game_loadProgress_c2s:string = "3001";
	public static ID_game_loadProgress_notice_s2c:string = "3002";
	public static ID_game_start_notice_s2c:string = "3004";
	public static ID_game_exit_c2s:string = "3005";
	public static ID_game_result_c2s:string = "3007";
	public static ID_game_result_notice_s2c:string = "3008";
	public static ID_game_event_c2s:string = "3009";
	public static ID_game_event_notice_s2c:string = "3010";
	public static ID_game_trunNumNotice_s2c:string = "3012";
	public static ID_game_matching_c2s:string = "3013";
	public static ID_game_matching_s2c:string = "3014";
	public static ID_game_matching_notice_s2c:string = "3016";
	public static ID_game_cancelMatching_c2s:string = "3017";
	public static ID_game_cancelMatching_s2c:string = "3018";
	

	public static decode (buff:egret.ByteArray):any{
		var msgId = buff.readUnsignedShort();
		var cls = Proto.dic[msgId];
		if(!cls){
			console.warn('收到未知消息ID：' + msgId);
			return null;
		}

		buff.position = 0;
		var data = new cls();
		data.decode(buff);
		return data;
	}
}

App.Proto = Proto;