using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy1Controller : MonoBehaviour {
	public GameObject EnemyBullet;
	public GameObject explode;

	float speed = 0.7f;
	float intervalTime;
    bool turning;

	// Use this for initialization
	void Start () {
        this.intervalTime = 0.0f;
        this.turning = false;
	}
	
	// Update is called once per frame
	void Update () {
        //プレイヤーからの距離
        float distance = this.transform.position.magnitude;

        //プレイヤーとの距離が一定以上
        if (distance > 100) {
            this.transform.LookAt(Vector3.zero);
            this.intervalTime += Time.deltaTime;

            //一定間隔で弾を撃つ
            if (intervalTime >= 0.3f) {
//                Quaternion quat = Quaternion.Euler(0, 180, 0);
//                Instantiate(EnemyBullet, new Vector3(transform.position.x, transform.position.y, transform.position.z), quat);
                this.intervalTime = 0.0f;
            }
        }
        this.transform.Translate(0, 0, this.speed);
	}

    public void OnGazeEnter() {
		Destroy(this, 0);
        Instantiate(
			explode,
			new Vector3(transform.position.x, transform.position.y, transform.position.z),
			Quaternion.identity);
    }

    public void OnGazeExit() {
    }
}
