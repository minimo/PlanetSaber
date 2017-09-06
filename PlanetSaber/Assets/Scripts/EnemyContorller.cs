using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyContorller : MonoBehaviour {

	public GameObject EnemyBullet;
	float Z_Speed = 0.7f;
	float intervalTime;

	// Use this for initialization
	void Start () {
        intervalTime = 0.0f;
	}
	
	// Update is called once per frame
	void Update () {
        transform.Translate(0, 0, 1 * Z_Speed);

        Quaternion quat = Quaternion.Euler(0, 180, 0);

        intervalTime += Time.deltaTime;
        if (intervalTime >= 0.3f) {
            intervalTime = 0.0f;
            Instantiate(EnemyBullet, new Vector3(transform.position.x, transform.position.y, transform.position.z), quat);
        }
    }
}
