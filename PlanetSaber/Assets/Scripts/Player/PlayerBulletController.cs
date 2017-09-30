using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerBulletController : MonoBehaviour {
    //弾速
    float speed = 4;

    //着弾エフェクト
    public GameObject effectImpact;
    public float impactScale = 1.0f;

    // Use this for initialization
    void Start () {
        Destroy(this.gameObject, 4);
    }
    // Update is called once per frame
    void Update () {
        this.transform.Translate(0, 0, this.speed);
    }

    public void impact() {
        GameObject exp = Instantiate(
            effectImpact,
            new Vector3(transform.position.x, transform.position.y, transform.position.z),
            Quaternion.identity);
        exp.transform.localScale　= new Vector3(this.impactScale, this.impactScale, this.impactScale);
        Destroy(this.gameObject);
    }
}
