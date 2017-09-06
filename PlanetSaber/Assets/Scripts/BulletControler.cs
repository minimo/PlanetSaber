using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BulletControler : MonoBehaviour {

    Vector3 progress;
    float speed = 2;

    // Use this for initialization
    void Start () {
        //カメラが見ている方向へ直進する
        Matrix4x4 mat = Camera.main.transform.localToWorldMatrix;
        progress = new Vector3(mat[0, 2] * speed, mat[1, 2] * speed, mat[2, 2] * speed);

        //５秒後に自分を削除する
        Destroy(this.gameObject, 5);		
    }

    // Update is called once per frame
    void Update () {
        transform.position += progress;
    }
}
