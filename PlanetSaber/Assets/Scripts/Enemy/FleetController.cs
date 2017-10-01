using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//艦隊管理
public class FleetController : MonoBehaviour {

    Transform[] ships;

    bool isWarp = false;

	// Use this for initialization
	void Start () {
    }

	// Update is called once per frame
	void Update () {
        if (this.isWarp) {
            this.isWarp = false;
            StartCoroutine(this.Warp());
//            transform.Translate(0.0f, 0.0f, 300.0f);
        }
	}

    public void startWarpSequence() {
        this.isWarp = true;
    }

    private IEnumerator Warp() {
		foreach(Transform child in transform) {
            child.gameObject.GetComponent<BattleShipController>().isWarp = true;
            yield return new WaitForSeconds(0.1f);
        }
    }
}
