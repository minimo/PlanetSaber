using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SceneController : MonoBehaviour {
	public GameObject explode1;
	public GameObject explode2;

	float intervalTime;

	// Use this for initialization
	void Start () {		
	}
	
	// Update is called once per frame
	void Update () {
    	this.intervalTime += Time.deltaTime;

        //一定間隔で爆発を投入
        if (intervalTime >= 1.0f) {
			Vector3 pos = new Vector3(Random.Range(-500, 500), Random.Range(-500, 500), Random.Range(-500, 500));
            Instantiate(explode1, pos, Quaternion.identity);
            this.intervalTime = 0.0f;
        }
	}
}
