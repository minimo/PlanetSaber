using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//艦隊管理
public class FleetController : MonoBehaviour {

    Transform[] ships;

    bool isWarp = false;

	// Use this for initialization
	void Start () {
        //艦隊内艦船を配列取得
        int i = 0;
        foreach (Transform child in this.transform){
            this.ships[i] = child;
            i++;
            Debug.Log("fleet");
        }
    }

	// Update is called once per frame
	void Update () {
        if (this.isWarp) {
            transform.Translate(0.0f, 0.0f, 300.0f);
        }		
	}

    public void startWarpSequence() {
        this.isWarp = true;
    }

    GameObject[] GetChildren(string parentName) {
        GameObject parent = GameObject.Find(parentName);
        if(parent == null) return null;
    }
}
