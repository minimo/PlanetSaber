using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneController : MonoBehaviour {
	public int score;

	//敵機
	public GameObject enemy1;
	public GameObject enemy2;

	//隕石
	public GameObject meteo_S;
	public GameObject meteo_XXL;

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

		//敵機投入
		if (this.time % 60 == 0) {
			Vector3 pos = new Vector3(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(0, 200));
            Instantiate(enemy1, pos, Quaternion.identity);
		}

		//隕石投入
		if (this.time % 90 == 0) {
			Vector3 pos = new Vector3(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(0, 200));
            Instantiate(meteo_S, pos, Quaternion.identity);
			pos = new Vector3(Random.Range(-10, 10), Random.Range(-10, 10), Random.Range(0, 200));
            Instantiate(meteo_XXL, pos, Quaternion.identity);
		}

		this.time++;
	}
}
