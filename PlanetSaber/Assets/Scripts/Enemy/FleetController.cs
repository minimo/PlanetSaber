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
        GameObject pl = GameObject.Find("VREye");
        pl.GetComponent<VREyeContorller>().startWarpSequence();
        yield return new WaitForSeconds(10.0f);

		foreach(Transform child in transform) {
//            child.gameObject.GetComponent<BattleShipController>().isWarp = true;
            yield return new WaitForSeconds(10.0f);
        }
        yield return null; //new WaitForSeconds(1.0f);
    }
}
