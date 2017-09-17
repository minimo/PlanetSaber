using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneController : MonoBehaviour {
	public int score;
	public GameObject enemy1;
	public GameObject explode1;
	public GameObject explode2;

	int time;

	// Use this for initialization
	void Start () {
	}

	// Update is called once per frame
	void Update () {
        //一定間隔で爆発を投入
        if (time % 10 == 0) {
			Vector3 pos = new Vector3(Random.Range(-500, 500), Random.Range(-500, 500), Random.Range(-500, 500));
            Instantiate(explode1, pos, Quaternion.identity);
        }

		if (this.time % 60 == 0) {
			Vector3 pos = new Vector3(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(0, 100));
            Instantiate(enemy1, pos, Quaternion.identity);
		}
		this.time++;
	}
}
