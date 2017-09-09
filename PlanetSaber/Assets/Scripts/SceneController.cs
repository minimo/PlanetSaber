using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SceneController : MonoBehaviour {

    public GameObject enemy1;

    float intervalTime = 10.0f;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
        this.intervalTime += Time.deltaTime;
        if (intervalTime >= 5.0f) {
            intervalTime = 0.0f;
			float x = this.transform.position.x + Random.Range(-30.0f, 30.0f);
			float y = this.transform.position.y + Random.Range(-30.0f, 30.0f);
			float z = this.transform.position.z + 200.0f;
            Vector3 pos = new Vector3 (x, y, z);
            Quaternion qua = new Quaternion ();
            Instantiate(enemy1, pos, Quaternion.identity);
		}
	}
}
