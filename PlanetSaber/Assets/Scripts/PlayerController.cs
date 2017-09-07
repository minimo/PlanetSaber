using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController: MonoBehaviour {

    public GameObject bullet;
    float intervalTime = 10.0f;

    // Use this for initialization
	void Start () {
	}
	
	// Update is called once per frame
	void Update () {
        intervalTime += Time.deltaTime;
        if (intervalTime >= 5.0f) {
            intervalTime = 0.0f;
            Vector3 pos = new Vector3 (transform.position.x, transform.position.y, transform.position.z + 10.0f);
            Quaternion qua = new Quaternion ();
            Instantiate(bullet, pos, Quaternion.identity);
        }
    }
}
