using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//艦隊管理
public class FleetController : MonoBehaviour {

	// Use this for initialization
	void Start () {
    }

	// Update is called once per frame
	void Update () {
	}

    public void startWarpSequence() {
        StartCoroutine(this.Warp());
    }

    private IEnumerator Warp() {

        //敵艦隊ワープ開始
		foreach(Transform child in transform) {
            child.gameObject.GetComponent<BattleShipController>().isWarp = true;
            yield return new WaitForSeconds(0.1f);
        }
        yield return new WaitForSeconds(1.0f);

        //プレイヤーワープ開始
        Camera.main.transform.rotation = Quaternion.Euler(0.0f, 180.0f, 0.0f);
        GameObject pl = GameObject.Find("VREye");
        pl.GetComponent<VREyeContorller>().startWarpSequence();
        yield return　new WaitForSeconds(0.5f);

        //スカイボックスの変更
        GameObject.Find("SceneController").GetComponent<SceneController>().changeSkybox(true);
    }
}
