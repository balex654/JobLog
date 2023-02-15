//
//  DashboardViewController.swift
//  Ride Track
//
//  Created by Ben Alexander on 10/18/22.
//

import UIKit
import Auth0
import CoreLocation
import CoreData

class DashboardViewController: UIViewController, CLLocationManagerDelegate {

    @IBOutlet weak var StartStopButton: UIButton!
    @IBOutlet weak var ViewActivitiesButton: UIButton!
    @IBOutlet weak var LogoutButton: UIButton!
    
    let location = CoreLocation.CLLocationManager()
    var activityStarted = false
    var context: NSManagedObjectContext?
    var currentActivity: Activity?
    let stopwatch = Stopwatch()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        StartStopButton.layer.cornerRadius = 17
        setupLocation()
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        context = appDelegate.persistentContainer.viewContext
        NotificationCenter.default.addObserver(self, selector: #selector(startActivity), name: Notification.Name("startActivity"), object: nil)
    }
    
    func setupLocation() {
        self.location.requestAlwaysAuthorization()
        self.location.requestWhenInUseAuthorization()
        self.location.delegate = self
        self.location.desiredAccuracy = kCLLocationAccuracyBest
        self.location.allowsBackgroundLocationUpdates = true
        self.location.pausesLocationUpdatesAutomatically = false
    }
    
    @IBAction func StartStopAction(_ sender: Any) {
        if activityStarted {
            stopActivity()
        }
        else {
            selectBike()
        }
    }
    
    func selectBike() {
        let bikeVC = self.storyboard!.instantiateViewController(withIdentifier: "bikesViewController") as! BikesViewController
        bikeVC.fromStartActivity = true
        self.present(bikeVC, animated: true)
    }
    
    @objc func startActivity() {
        currentActivity = Activity(context: context!)
        currentActivity!.startDate = Date()
        currentActivity!.userId = Variables.user.id
        currentActivity!.bikeId = Int32(Variables.selectedBike.id)
        currentActivity!.totalMass = Variables.selectedBike.weight + Variables.user.weight
        activityStarted = true
        StartStopButton.backgroundColor = UIColor.red
        StartStopButton.setTitle("Stop Activity", for: .normal)
        ViewActivitiesButton.isUserInteractionEnabled = false
        LogoutButton.isUserInteractionEnabled = false
        location.startUpdatingLocation()
        stopwatch.start()
    }
    
    func stopActivity() {
        stopwatch.stop()
        let alert = UIAlertController(title: "Enter Activity Name", message: nil, preferredStyle: .alert)
        alert.addTextField { (UITextField) in
            UITextField.text = "Activity"
        }
        alert.addAction(UIAlertAction(title: "Save Activity", style: .default, handler: { action in
            let name = alert.textFields![0] as UITextField
            self.currentActivity!.endDate = Date()
            self.currentActivity!.name = name.text!
            self.currentActivity!.movingTime = self.stopwatch.elapsedTime()
            do {
                try self.context!.save()
                self.resetTracking()
            } catch let error as NSError {
                print ("Error saving. \(error), \(error.userInfo)")
            }
        }))
        self.present(alert, animated: true)
    }
    
    func resetTracking() {
        currentActivity = Activity(context: context!)
        activityStarted = false
        StartStopButton.backgroundColor = UIColor.systemGreen
        StartStopButton.setTitle("Start Activity", for: .normal)
        ViewActivitiesButton.isUserInteractionEnabled = true
        LogoutButton.isUserInteractionEnabled = true
        location.stopUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let locValue: CLLocationCoordinate2D = manager.location?.coordinate else { return }
        if manager.location!.speed > 0.0 {
            stopwatch.start()
            let gpsPoint = GpsPoint(context: context!)
            gpsPoint.date = Date().dateToString(date: manager.location!.timestamp, format: "yyyy-MM-dd'T'HH:mm:ss.SSS")
            gpsPoint.speed = manager.location!.speed
            gpsPoint.altitude = manager.location!.altitude
            gpsPoint.latitude = locValue.latitude
            gpsPoint.longitude = locValue.latitude
            gpsPoint.gpsPointRelation = currentActivity
        }
        else {
            stopwatch.stop()
        }
    }
    
    @IBAction func LogoutAction(_ sender: Any) {
        Task {
            do {
                let credentialsManager = CredentialsManager(authentication: Auth0.authentication())
                let _ = credentialsManager.clear()
                Variables.user = User()
                self.dismiss(animated: true)
                try await Auth0.webAuth().clearSession()
            }
            catch {
                print("Error logging out")
            }
        }
    }
}
